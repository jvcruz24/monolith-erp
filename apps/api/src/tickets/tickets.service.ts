import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Prisma } from "@repo/db";
import type {
  CreateTicketInput,
  MoveTicketInput,
  UpdateTicketInput,
} from "@repo/validators";
import { PrismaService } from "../prisma/prisma.service.js";
import { AccessService } from "../tenant/access.service.js";
import { activityRows, type ActivityEntry } from "./activity.js";
import { positionBetween, STEP } from "./position.js";

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  // Optional references are single-column keys, so the same-company check lives here (doc section 7).
  private async assertMember(organizationId: string, memberId: string) {
    const member = await this.prisma.client.member.findFirst({
      where: { id: memberId, organizationId },
      select: { id: true },
    });
    if (!member) {
      throw new BadRequestException("Assignee is not a member of this company");
    }
  }

  async getBoard(userId: string, organizationId: string, projectId: string) {
    await this.access.require(userId, organizationId, "ticket:read");
    const db = this.prisma.forOrg(organizationId);

    const project = await db.project.findFirst({ where: { id: projectId } });
    if (!project) throw new NotFoundException("Project not found");

    const [statuses, tickets] = await Promise.all([
      db.ticketStatus.findMany({
        where: { projectId },
        orderBy: [{ position: "asc" }, { id: "asc" }],
      }),
      db.ticket.findMany({
        where: { projectId, deletedAt: null, parentId: null },
        orderBy: [{ position: "asc" }, { id: "asc" }],
        select: {
          id: true,
          number: true,
          title: true,
          priority: true,
          position: true,
          statusId: true,
          assigneeMemberId: true,
          dueDate: true,
          completedAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      project: { id: project.id, key: project.key, name: project.name },
      statuses: statuses.map((status) => ({
        ...status,
        tickets: tickets
          .filter((ticket) => ticket.statusId === status.id)
          .map((ticket) => ({
            ...ticket,
            key: `${project.key}-${ticket.number}`,
          })),
      })),
    };
  }

  async create(
    userId: string,
    organizationId: string,
    projectId: string,
    input: CreateTicketInput,
  ) {
    await this.access.require(userId, organizationId, "ticket:write");
    if (input.assigneeMemberId) {
      await this.assertMember(organizationId, input.assigneeMemberId);
    }

    return this.prisma.forOrg(organizationId).$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: { id: projectId, archivedAt: null },
      });
      if (!project)
        throw new NotFoundException("Project not found or archived");

      const status = input.statusId
        ? await tx.ticketStatus.findFirst({
            where: { id: input.statusId, projectId },
          })
        : await tx.ticketStatus.findFirst({
            where: { projectId },
            orderBy: [{ position: "asc" }, { id: "asc" }],
          });
      if (!status)
        throw new BadRequestException("Status not found in this project");

      const last = await tx.ticket.findFirst({
        where: { statusId: status.id, deletedAt: null },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      const position = last ? last.position + STEP : STEP;

      // The UPDATE locks the project row, so concurrent creates take turns.
      const counter = await tx.project.update({
        where: { id: projectId },
        data: { nextTicketNumber: { increment: 1 } },
        select: { nextTicketNumber: true },
      });
      const number = counter.nextTicketNumber - 1;

      const ticket = await tx.ticket.create({
        data: {
          organizationId,
          projectId,
          number,
          title: input.title,
          description: input.description,
          statusId: status.id,
          priority: input.priority ?? "NONE",
          position,
          assigneeMemberId: input.assigneeMemberId,
          createdById: userId,
          dueDate: input.dueDate,
          completedAt: status.category === "DONE" ? new Date() : null,
        },
      });

      await tx.ticketActivity.createMany({
        data: activityRows(
          { organizationId, ticketId: ticket.id, actorId: userId },
          [{ type: "TICKET_CREATED", data: { number, statusId: status.id } }],
        ),
      });

      return { ...ticket, key: `${project.key}-${ticket.number}` };
    });
  }

  async update(
    userId: string,
    organizationId: string,
    ticketId: string,
    input: UpdateTicketInput,
  ) {
    await this.access.require(userId, organizationId, "ticket:write");
    if (input.assigneeMemberId) {
      await this.assertMember(organizationId, input.assigneeMemberId);
    }

    return this.prisma.forOrg(organizationId).$transaction(async (tx) => {
      const current = await tx.ticket.findFirst({
        where: { id: ticketId, deletedAt: null },
      });
      if (!current) throw new NotFoundException("Ticket not found");

      const data: Prisma.TicketUncheckedUpdateInput = {};
      const entries: ActivityEntry[] = [];

      if (input.title !== undefined && input.title !== current.title) {
        data.title = input.title;
        entries.push({
          type: "TITLE_CHANGED",
          data: { from: current.title, to: input.title },
        });
      }
      if (
        input.description !== undefined &&
        input.description !== current.description
      ) {
        data.description = input.description;
        entries.push({ type: "DESCRIPTION_CHANGED" });
      }
      if (input.priority !== undefined && input.priority !== current.priority) {
        data.priority = input.priority;
        entries.push({
          type: "PRIORITY_CHANGED",
          data: { from: current.priority, to: input.priority },
        });
      }
      if (
        input.assigneeMemberId !== undefined &&
        input.assigneeMemberId !== current.assigneeMemberId
      ) {
        data.assigneeMemberId = input.assigneeMemberId;
        entries.push({
          type: "ASSIGNEE_CHANGED",
          data: { from: current.assigneeMemberId, to: input.assigneeMemberId },
        });
      }
      if (input.dueDate !== undefined) {
        const before = current.dueDate?.getTime() ?? null;
        const after = input.dueDate?.getTime() ?? null;
        if (before !== after) {
          data.dueDate = input.dueDate;
          entries.push({
            type: "DUE_DATE_CHANGED",
            data: {
              from: current.dueDate?.toISOString() ?? null,
              to: input.dueDate?.toISOString() ?? null,
            },
          });
        }
      }

      if (entries.length === 0) return current;

      const updated = await tx.ticket.update({ where: { id: ticketId }, data });
      await tx.ticketActivity.createMany({
        data: activityRows(
          { organizationId, ticketId, actorId: userId },
          entries,
        ),
      });
      return updated;
    });
  }

  async move(
    userId: string,
    organizationId: string,
    ticketId: string,
    input: MoveTicketInput,
  ) {
    await this.access.require(userId, organizationId, "ticket:write");
    if (input.afterTicketId === ticketId) {
      throw new BadRequestException("A ticket cannot be placed after itself");
    }

    return this.prisma.forOrg(organizationId).$transaction(async (tx) => {
      const ticket = await tx.ticket.findFirst({
        where: { id: ticketId, deletedAt: null },
      });
      if (!ticket) throw new NotFoundException("Ticket not found");

      const target = await tx.ticketStatus.findFirst({
        where: { id: input.statusId, projectId: ticket.projectId },
      });
      if (!target) {
        throw new BadRequestException(
          "Status not found in this ticket's project",
        );
      }

      // Everything in the target column except the ticket being moved
      const column = {
        statusId: target.id,
        deletedAt: null,
        id: { not: ticket.id },
      };

      const neighbours = async () => {
        let above: { position: number } | null = null;
        if (input.afterTicketId) {
          above = await tx.ticket.findFirst({
            where: { ...column, id: input.afterTicketId },
            select: { position: true },
          });
          if (!above) {
            throw new BadRequestException(
              "afterTicketId is not in the target column",
            );
          }
        }
        const below = await tx.ticket.findFirst({
          where: {
            ...column,
            ...(above ? { position: { gt: above.position } } : {}),
          },
          orderBy: [{ position: "asc" }, { id: "asc" }],
          select: { position: true },
        });
        return {
          above: above?.position ?? null,
          below: below?.position ?? null,
        };
      };

      const rebalance = async () => {
        const rows = await tx.ticket.findMany({
          where: column,
          orderBy: [{ position: "asc" }, { id: "asc" }],
          select: { id: true },
        });
        for (const [index, row] of rows.entries()) {
          await tx.ticket.update({
            where: { id: row.id },
            data: { position: (index + 1) * STEP },
          });
        }
      };

      let { above, below } = await neighbours();
      let position = positionBetween(above, below);
      if (position === null) {
        await rebalance();
        ({ above, below } = await neighbours());
        position = positionBetween(above, below);
        if (position === null) throw new Error("Could not compute a position");
      }

      const completedAt =
        target.category === "DONE" ? (ticket.completedAt ?? new Date()) : null;

      const moved = await tx.ticket.update({
        where: { id: ticket.id },
        data: { statusId: target.id, position, completedAt },
      });

      if (target.id !== ticket.statusId) {
        const from = await tx.ticketStatus.findFirst({
          where: { id: ticket.statusId },
          select: { name: true },
        });
        await tx.ticketActivity.createMany({
          data: activityRows({ organizationId, ticketId, actorId: userId }, [
            {
              type: "STATUS_CHANGED",
              data: {
                fromStatusId: ticket.statusId,
                toStatusId: target.id,
                from: from?.name ?? null,
                to: target.name,
              },
            },
          ]),
        });
      }

      return moved;
    });
  }

  async remove(userId: string, organizationId: string, ticketId: string) {
    const roles = await this.access.require(
      userId,
      organizationId,
      "ticket:write",
    );

    await this.prisma.forOrg(organizationId).$transaction(async (tx) => {
      const ticket = await tx.ticket.findFirst({
        where: { id: ticketId, deletedAt: null },
      });
      if (!ticket) throw new NotFoundException("Ticket not found");

      if (!this.access.isManager(roles) && ticket.createdById !== userId) {
        throw new ForbiddenException(
          "Members can only delete their own tickets",
        );
      }

      await tx.ticket.update({
        where: { id: ticketId },
        data: { deletedAt: new Date() },
      });
      await tx.ticketActivity.createMany({
        data: activityRows({ organizationId, ticketId, actorId: userId }, [
          { type: "TICKET_DELETED" },
        ]),
      });
    });
  }
}

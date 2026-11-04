import { ConflictException, Injectable } from "@nestjs/common";
import type { CreateProjectInput } from "@repo/validators";
import { PrismaService } from "../prisma/prisma.service.js";
import { AccessService } from "../tenant/access.service.js";

const DEFAULT_STATUSES = [
  { name: "To do", category: "TODO" },
  { name: "In progress", category: "IN_PROGRESS" },
  { name: "Done", category: "DONE" },
] as const;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async list(userId: string, organizationId: string) {
    await this.access.require(userId, organizationId, "project:read");
    return this.prisma.forOrg(organizationId).project.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(
    userId: string,
    organizationId: string,
    input: CreateProjectInput,
  ) {
    await this.access.require(userId, organizationId, "project:manage");

    try {
      return await this.prisma
        .forOrg(organizationId)
        .$transaction(async (tx) => {
          const project = await tx.project.create({
            data: {
              organizationId,
              createdById: userId,
              name: input.name,
              key: input.key,
              description: input.description,
            },
          });
          await tx.ticketStatus.createMany({
            data: DEFAULT_STATUSES.map((status, index) => ({
              organizationId,
              projectId: project.id,
              name: status.name,
              category: status.category,
              position: (index + 1) * 1024,
            })),
          });
          return project;
        });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          `A project with the key ${input.key} already exists`,
        );
      }
      throw error;
    }
  }
}

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { prisma } from "@repo/db";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  cleanup,
  createCompany,
  newProject,
  projects,
  tickets,
  type Company,
} from "./helpers.js";

let a: Company;
let b: Company;

beforeAll(async () => {
  a = await createCompany("a");
  b = await createCompany("b");
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

// A fresh project per test keeps the tests independent.
async function setup(key: string) {
  const project = await newProject(a, key);
  const board = await tickets.getBoard(
    a.owner.id,
    a.organization.id,
    project.id,
  );
  const [todo, doing, done] = board.statuses;

  const make = (title: string, userId = a.owner.id) =>
    tickets.create(userId, a.organization.id, project.id, { title });

  const titles = async (statusId: string) => {
    const current = await tickets.getBoard(
      a.owner.id,
      a.organization.id,
      project.id,
    );
    return current.statuses
      .find((s) => s.id === statusId)!
      .tickets.map((t) => t.title);
  };

  const move = (
    ticketId: string,
    statusId: string,
    afterTicketId: string | null,
  ) =>
    tickets.move(a.owner.id, a.organization.id, ticketId, {
      statusId,
      afterTicketId,
    });

  return { project, todo, doing, done, make, titles, move };
}

describe("numbering", () => {
  it("gives concurrent creates unique, gapless numbers", async () => {
    const project = await newProject(a, "NUM");
    const created = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        tickets.create(a.owner.id, a.organization.id, project.id, {
          title: `t${i}`,
        }),
      ),
    );
    expect(created.map((t) => t.number).sort((x, y) => x - y)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(created[0]!.key).toMatch(/^NUM-\d+$/);
  });
});

describe("board", () => {
  it("returns columns in order, with tickets in creation order", async () => {
    const s = await setup("BRD");
    await s.make("first");
    await s.make("second");
    const board = await tickets.getBoard(
      a.owner.id,
      a.organization.id,
      s.project.id,
    );
    expect(board.statuses.map((x) => x.name)).toEqual([
      "To do",
      "In progress",
      "Done",
    ]);
    expect(board.statuses[0]!.tickets.map((t) => t.title)).toEqual([
      "first",
      "second",
    ]);
    expect(board.statuses[0]!.tickets[0]!.key).toBe("BRD-1");
  });
});

describe("moving", () => {
  it("reorders within a column", async () => {
    const s = await setup("MVA");
    const t1 = await s.make("t1");
    const t2 = await s.make("t2");
    const t3 = await s.make("t3");

    await s.move(t3.id, s.todo!.id, null);
    expect(await s.titles(s.todo!.id)).toEqual(["t3", "t1", "t2"]);

    await s.move(t1.id, s.todo!.id, t2.id);
    expect(await s.titles(s.todo!.id)).toEqual(["t3", "t2", "t1"]);
  });

  it("moves across columns, tracks completion and writes history", async () => {
    const s = await setup("MVB");
    const t = await s.make("x");

    expect((await s.move(t.id, s.doing!.id, null)).completedAt).toBeNull();
    expect((await s.move(t.id, s.done!.id, null)).completedAt).not.toBeNull();
    expect((await s.move(t.id, s.doing!.id, null)).completedAt).toBeNull();

    const log = await prisma.ticketActivity.findMany({
      where: { ticketId: t.id },
    });
    expect(log.map((l) => l.type).sort()).toEqual([
      "STATUS_CHANGED",
      "STATUS_CHANGED",
      "STATUS_CHANGED",
      "TICKET_CREATED",
    ]);
  });

  it("renumbers a column when the gap gets too small", async () => {
    const s = await setup("MVC");
    const t1 = await s.make("t1");
    const t2 = await s.make("t2");
    const t3 = await s.make("t3");
    await prisma.ticket.update({ where: { id: t1.id }, data: { position: 1 } });
    await prisma.ticket.update({
      where: { id: t2.id },
      data: { position: 1.0000001 },
    });

    await s.move(t3.id, s.todo!.id, t1.id);
    expect(await s.titles(s.todo!.id)).toEqual(["t1", "t3", "t2"]);
  });

  it("rejects an anchor from another column", async () => {
    const s = await setup("MVD");
    const t1 = await s.make("t1");
    const t2 = await s.make("t2");
    await expect(s.move(t2.id, s.doing!.id, t1.id)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});

describe("updating", () => {
  it("records only real changes", async () => {
    const s = await setup("UPD");
    const t = await s.make("old");
    await tickets.update(a.owner.id, a.organization.id, t.id, {
      title: "old",
      priority: "HIGH",
    });
    const log = await prisma.ticketActivity.findMany({
      where: { ticketId: t.id },
    });
    expect(log.map((l) => l.type).sort()).toEqual([
      "PRIORITY_CHANGED",
      "TICKET_CREATED",
    ]);
  });
});

describe("permissions", () => {
  it("lets members create tickets but not projects", async () => {
    await expect(
      projects.create(a.m1User.id, a.organization.id, {
        name: "x",
        key: "XXX",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    const s = await setup("PRM");
    await expect(s.make("by a member", a.m1User.id)).resolves.toBeDefined();
  });

  it("lets members delete only their own tickets", async () => {
    const s = await setup("DEL");
    const mine = await s.make("mine", a.m1User.id);

    await expect(
      tickets.remove(a.m2User.id, a.organization.id, mine.id),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await tickets.remove(a.m1User.id, a.organization.id, mine.id);
    expect(await s.titles(s.todo!.id)).toEqual([]);
    await expect(
      tickets.remove(a.m1User.id, a.organization.id, mine.id),
    ).rejects.toBeInstanceOf(NotFoundException);

    const theirs = await s.make("a member's ticket", a.m1User.id);
    await tickets.remove(a.owner.id, a.organization.id, theirs.id); // managers can delete any
  });

  it("rejects people who are not members of the company", async () => {
    const s = await setup("OUT");
    await expect(
      tickets.getBoard(b.owner.id, a.organization.id, s.project.id),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});

describe("isolation", () => {
  it("hides company A's board and tickets from company B", async () => {
    const s = await setup("ISO");
    const t = await s.make("secret");
    const org = b.organization.id;

    await expect(
      tickets.getBoard(b.owner.id, org, s.project.id),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      tickets.update(b.owner.id, org, t.id, { title: "x" }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      tickets.move(b.owner.id, org, t.id, {
        statusId: s.todo!.id,
        afterTicketId: null,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(tickets.remove(b.owner.id, org, t.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(
      tickets.create(b.owner.id, org, s.project.id, { title: "x" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("refuses an assignee from another company", async () => {
    const s = await setup("ASG");
    await expect(
      tickets.create(a.owner.id, a.organization.id, s.project.id, {
        title: "x",
        assigneeMemberId: b.m1.id,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    const t = await s.make("y");
    await expect(
      tickets.update(a.owner.id, a.organization.id, t.id, {
        assigneeMemberId: b.m1.id,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      tickets.update(a.owner.id, a.organization.id, t.id, {
        assigneeMemberId: a.m1.id,
      }),
    ).resolves.toBeDefined();
  });
});

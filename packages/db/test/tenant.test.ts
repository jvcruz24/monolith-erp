import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma, scopeToOrganization } from "../src/index.js";

const run = Math.random().toString(36).slice(2, 8);

type Tenant = {
  orgId: string;
  userId: string;
  projectId: string;
  statusId: string;
  db: ReturnType<typeof scopeToOrganization>;
};

async function createTenant(label: string): Promise<Tenant> {
  const now = new Date();
  const org = await prisma.organization.create({
    data: {
      id: `org-${label}-${run}`,
      name: label,
      slug: `${label}-${run}`,
      createdAt: now,
    },
  });
  const user = await prisma.user.create({
    data: {
      id: `user-${label}-${run}`,
      name: label,
      email: `${label}-${run}@test.local`,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  const db = scopeToOrganization(org.id);
  // Both companies use the same key on purpose: keys are unique per company.
  const project = await db.project.create({
    data: {
      organizationId: org.id,
      createdById: user.id,
      name: `${label} project`,
      key: "ENG",
    },
  });
  const status = await db.ticketStatus.create({
    data: {
      organizationId: org.id,
      projectId: project.id,
      name: "To do",
      category: "TODO",
      position: 1024,
    },
  });

  return {
    orgId: org.id,
    userId: user.id,
    projectId: project.id,
    statusId: status.id,
    db,
  };
}

let a: Tenant;
let b: Tenant;

beforeAll(async () => {
  a = await createTenant("a");
  b = await createTenant("b");
});

afterAll(async () => {
  // Deleting the organizations cascades to every tenant row.
  await prisma.organization.deleteMany({
    where: { id: { in: [a.orgId, b.orgId] } },
  });
  await prisma.user.deleteMany({ where: { id: { in: [a.userId, b.userId] } } });
  await prisma.$disconnect();
});

describe("reads", () => {
  it("lists only the company's own rows", async () => {
    const seenByA = await a.db.project.findMany();
    expect(seenByA.map((p) => p.id)).toEqual([a.projectId]);
    const seenByB = await b.db.project.findMany();
    expect(seenByB.map((p) => p.id)).toEqual([b.projectId]);
  });

  it("cannot read another company's row by guessing its id", async () => {
    expect(
      await a.db.project.findUnique({ where: { id: b.projectId } }),
    ).toBeNull();
    expect(
      await a.db.project.findFirst({ where: { id: b.projectId } }),
    ).toBeNull();
    await expect(
      a.db.project.findUniqueOrThrow({ where: { id: b.projectId } }),
    ).rejects.toThrow();
  });

  it("scopes counts", async () => {
    expect(await a.db.project.count()).toBe(1);
    expect(await a.db.ticketStatus.count()).toBe(1);
  });
});

describe("writes", () => {
  it("cannot update another company's row", async () => {
    await expect(
      a.db.project.update({
        where: { id: b.projectId },
        data: { name: "hijacked" },
      }),
    ).rejects.toThrow();
    const bulk = await a.db.project.updateMany({
      where: { id: b.projectId },
      data: { name: "hijacked" },
    });
    expect(bulk.count).toBe(0);
    const untouched = await prisma.project.findUniqueOrThrow({
      where: { id: b.projectId },
    });
    expect(untouched.name).toBe("b project");
  });

  it("cannot delete another company's row", async () => {
    await expect(
      a.db.project.delete({ where: { id: b.projectId } }),
    ).rejects.toThrow();
    const bulk = await a.db.project.deleteMany({ where: { id: b.projectId } });
    expect(bulk.count).toBe(0);
    expect(
      await prisma.project.findUnique({ where: { id: b.projectId } }),
    ).not.toBeNull();
  });

  it("refuses to create a row for another company", async () => {
    await expect(
      a.db.project.create({
        data: {
          organizationId: b.orgId,
          createdById: a.userId,
          name: "x",
          key: "ZZZ",
        },
      }),
    ).rejects.toThrow(/Cross-tenant/);
  });

  it("refuses to move a row to another company", async () => {
    await expect(
      a.db.project.update({
        where: { id: a.projectId },
        data: { organizationId: b.orgId },
      }),
    ).rejects.toThrow(/cannot be changed/);
  });

  it("refuses operations the scoping does not cover", async () => {
    await expect(
      a.db.project.createManyAndReturn({
        data: [
          {
            organizationId: a.orgId,
            createdById: a.userId,
            name: "n",
            key: "NNN",
          },
        ],
      }),
    ).rejects.toThrow(/not allowed/);
  });

  it("keeps keys unique within a company", async () => {
    await expect(
      a.db.project.create({
        data: {
          organizationId: a.orgId,
          createdById: a.userId,
          name: "dup",
          key: "ENG",
        },
      }),
    ).rejects.toThrow();
  });
});

describe("transactions", () => {
  it("applies the scoping inside interactive transactions", async () => {
    const seen = await a.db.$transaction(async (tx) => tx.project.findMany());
    expect(seen.map((p) => p.id)).toEqual([a.projectId]);
  });
});

describe("database constraints (bypassing the scoped client)", () => {
  it("rejects a column that points at another company's project", async () => {
    await expect(
      prisma.ticketStatus.create({
        data: {
          organizationId: b.orgId,
          projectId: a.projectId,
          name: "Bad",
          category: "TODO",
          position: 1,
        },
      }),
    ).rejects.toThrow();
  });

  it("rejects a ticket that points at another company's column", async () => {
    await expect(
      prisma.ticket.create({
        data: {
          organizationId: a.orgId,
          projectId: a.projectId,
          number: 1,
          title: "Bad",
          statusId: b.statusId,
          position: 1,
          createdById: a.userId,
        },
      }),
    ).rejects.toThrow();
  });
});

describe("tickets", () => {
  it("are invisible to the other company", async () => {
    const ticket = await a.db.ticket.create({
      data: {
        organizationId: a.orgId,
        projectId: a.projectId,
        number: 1,
        title: "Only A can see this",
        statusId: a.statusId,
        position: 1024,
        createdById: a.userId,
      },
    });
    expect(await b.db.ticket.findMany()).toEqual([]);
    expect(
      await b.db.ticket.findUnique({ where: { id: ticket.id } }),
    ).toBeNull();
  });
});

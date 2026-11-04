import { prisma } from "@repo/db";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { ProjectsService } from "../src/projects/projects.service.js";
import { AccessService } from "../src/tenant/access.service.js";
import { TicketsService } from "../src/tickets/tickets.service.js";

export const run = Math.random().toString(36).slice(2, 8);

const prismaService = new PrismaService();
export const access = new AccessService(prismaService);
export const projects = new ProjectsService(prismaService, access);
export const tickets = new TicketsService(prismaService, access);

async function createUser(name: string) {
  const now = new Date();
  return prisma.user.create({
    data: {
      id: `user-${name}-${run}`,
      name,
      email: `${name}-${run}@test.local`,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });
}

function addMember(organizationId: string, userId: string, role: string) {
  return prisma.member.create({
    data: {
      id: `mem-${userId}`,
      organizationId,
      userId,
      role,
      createdAt: new Date(),
    },
  });
}

export async function createCompany(label: string) {
  const organization = await prisma.organization.create({
    data: {
      id: `org-${label}-${run}`,
      name: label,
      slug: `${label}-${run}`,
      createdAt: new Date(),
    },
  });
  const owner = await createUser(`${label}-owner`);
  const m1User = await createUser(`${label}-m1`);
  const m2User = await createUser(`${label}-m2`);
  await addMember(organization.id, owner.id, "owner");
  const m1 = await addMember(organization.id, m1User.id, "member");
  const m2 = await addMember(organization.id, m2User.id, "member");
  return { organization, owner, m1User, m1, m2User, m2 };
}

export type Company = Awaited<ReturnType<typeof createCompany>>;

export function newProject(company: Company, key: string) {
  return projects.create(company.owner.id, company.organization.id, {
    name: `${key} project`,
    key,
  });
}

export async function cleanup() {
  // Deleting organizations cascades to projects, tickets and members.
  await prisma.organization.deleteMany({ where: { id: { endsWith: run } } });
  await prisma.user.deleteMany({ where: { id: { endsWith: run } } });
}

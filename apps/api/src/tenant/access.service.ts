import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

const RULES = {
  "project:manage": ["owner", "admin"],
  "status:manage": ["owner", "admin"],
  "label:manage": ["owner", "admin"],
  "ticket:write": ["owner", "admin", "member"],
  "comment:write": ["owner", "admin", "member"],
} as const;

export type Action = keyof typeof RULES;

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async require(userId: string, organizationId: string, action: Action) {
    const member = await this.prisma.client.member.findFirst({
      where: { userId, organizationId },
      select: { role: true },
    });
    // Better Auth may store several roles as "admin,member"
    const roles = (member?.role ?? "").split(",").map((role) => role.trim());
    const allowed = roles.some((role) =>
      (RULES[action] as readonly string[]).includes(role),
    );
    if (!allowed) {
      throw new ForbiddenException("You do not have permission to do that");
    }
  }
}

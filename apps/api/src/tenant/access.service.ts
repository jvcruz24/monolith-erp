import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

const RULES = {
  "project:read": ["owner", "admin", "member"],
  "project:manage": ["owner", "admin"],
  "status:manage": ["owner", "admin"],
  "label:manage": ["owner", "admin"],
  "ticket:read": ["owner", "admin", "member"],
  "ticket:write": ["owner", "admin", "member"],
  "comment:write": ["owner", "admin", "member"],
} as const;

export type Action = keyof typeof RULES;

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async roles(userId: string, organizationId: string): Promise<string[]> {
    const member = await this.prisma.client.member.findFirst({
      where: { userId, organizationId },
      select: { role: true },
    });
    // Better Auth may store several roles as "admin,member"
    return (member?.role ?? "")
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  async require(
    userId: string,
    organizationId: string,
    action: Action,
  ): Promise<string[]> {
    const roles = await this.roles(userId, organizationId);
    const allowed = roles.some((role) =>
      (RULES[action] as readonly string[]).includes(role),
    );
    if (!allowed) {
      throw new ForbiddenException("You do not have permission to do that");
    }
    return roles;
  }

  isManager(roles: string[]) {
    return roles.some((role) => role === "owner" || role === "admin");
  }
}

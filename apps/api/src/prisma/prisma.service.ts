import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { prisma, scopeToOrganization } from "@repo/db";

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client = prisma;

  forOrg(organizationId: string): ReturnType<typeof scopeToOrganization> {
    return scopeToOrganization(organizationId);
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}

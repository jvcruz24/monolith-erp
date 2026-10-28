import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client = prisma;

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}

import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PrismaService } from './prisma/prisma.service.js';

@AllowAnonymous()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const companies = await this.prisma.client.company.count();
    return { status: 'ok', companies };
  }
}

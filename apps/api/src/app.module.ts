import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module.js";
import { HealthController } from "./health.controller.js";
import { MeController } from "./me.controller.js";
import { TenantModule } from "./tenant/tenant.module.js";
import { ProjectsModule } from "./projects/projects.module.js";
import { TicketsModule } from "./tickets/tickets.module.js";

//AUTH
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "@repo/auth";

@Module({
  imports: [
    PrismaModule,
    AuthModule.forRoot({ auth }),
    TenantModule,
    ProjectsModule,
    TicketsModule,
  ],
  controllers: [HealthController, MeController],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module.js";
import { HealthController } from "./health.controller.js";
import { MeController } from "./me.controller.js";

//AUTH
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "@repo/auth";

@Module({
  imports: [PrismaModule, AuthModule.forRoot({ auth })],
  controllers: [HealthController, MeController],
})
export class AppModule {}

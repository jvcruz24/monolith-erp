import { Body, Controller, Get, Post } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { createProjectSchema } from "@repo/validators";
import { parseBody } from "../common/parse-body.js";
import { ActiveOrg } from "../tenant/active-org.decorator.js";
import { ProjectsService } from "./projects.service.js";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list(@ActiveOrg() organizationId: string) {
    return this.projects.list(organizationId);
  }

  @Post()
  create(
    @Session() session: UserSession,
    @ActiveOrg() organizationId: string,
    @Body() body: unknown,
  ) {
    const input = parseBody(createProjectSchema, body);
    return this.projects.create(session.user.id, organizationId, input);
  }
}

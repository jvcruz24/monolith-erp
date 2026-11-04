import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import {
  createTicketSchema,
  moveTicketSchema,
  updateTicketSchema,
} from "@repo/validators";
import { parseBody } from "../common/parse-body.js";
import { ActiveOrg } from "../tenant/active-org.decorator.js";
import { TicketsService } from "./tickets.service.js";

@Controller()
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get("projects/:projectId/board")
  board(
    @Session() session: UserSession,
    @ActiveOrg() organizationId: string,
    @Param("projectId") projectId: string,
  ) {
    return this.tickets.getBoard(session.user.id, organizationId, projectId);
  }

  @Post("projects/:projectId/tickets")
  create(
    @Session() session: UserSession,
    @ActiveOrg() organizationId: string,
    @Param("projectId") projectId: string,
    @Body() body: unknown,
  ) {
    const input = parseBody(createTicketSchema, body);
    return this.tickets.create(
      session.user.id,
      organizationId,
      projectId,
      input,
    );
  }

  @Patch("tickets/:ticketId")
  update(
    @Session() session: UserSession,
    @ActiveOrg() organizationId: string,
    @Param("ticketId") ticketId: string,
    @Body() body: unknown,
  ) {
    const input = parseBody(updateTicketSchema, body);
    return this.tickets.update(
      session.user.id,
      organizationId,
      ticketId,
      input,
    );
  }

  @Post("tickets/:ticketId/move")
  @HttpCode(200)
  move(
    @Session() session: UserSession,
    @ActiveOrg() organizationId: string,
    @Param("ticketId") ticketId: string,
    @Body() body: unknown,
  ) {
    const input = parseBody(moveTicketSchema, body);
    return this.tickets.move(session.user.id, organizationId, ticketId, input);
  }

  @Delete("tickets/:ticketId")
  @HttpCode(204)
  async remove(
    @Session() session: UserSession,
    @ActiveOrg() organizationId: string,
    @Param("ticketId") ticketId: string,
  ) {
    await this.tickets.remove(session.user.id, organizationId, ticketId);
  }
}

import {
  createParamDecorator,
  ForbiddenException,
  type ExecutionContext,
} from "@nestjs/common";

export const ActiveOrg = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const organizationId = request.session?.session?.activeOrganizationId;
    if (!organizationId) {
      throw new ForbiddenException("No active company");
    }
    return organizationId;
  },
);

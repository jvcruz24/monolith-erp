import type { Prisma } from "@repo/db";

export type ActivityEntry = {
  type: Prisma.TicketActivityCreateManyInput["type"];
  data?: Prisma.InputJsonObject;
};

export function activityRows(
  base: { organizationId: string; ticketId: string; actorId: string },
  entries: ActivityEntry[],
) {
  return entries.map((entry) => ({
    ...base,
    type: entry.type,
    data: entry.data,
  }));
}

import { prisma } from "./client.js";

const TENANT_MODELS = new Set([
  "Project",
  "TicketStatus",
  "Ticket",
  "Label",
  "TicketLabel",
  "TicketComment",
  "TicketActivity",
]);

const FILTERED = new Set([
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
  "updateMany",
  "deleteMany",
]);
const UNIQUE = new Set(["findUnique", "findUniqueOrThrow", "update", "delete"]);

export function scopeToOrganization(organizationId: string) {
  const own = (row: Record<string, unknown>) => {
    if (
      row.organizationId !== undefined &&
      row.organizationId !== organizationId
    ) {
      throw new Error("Cross-tenant write blocked");
    }
    return { ...row, organizationId };
  };

  const noReassign = (data: Record<string, unknown> | undefined) => {
    if (data && "organizationId" in data) {
      throw new Error("organizationId cannot be changed");
    }
  };

  return prisma.$extends({
    name: "tenant-scope",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!TENANT_MODELS.has(model)) return query(args);
          const a = { ...(args ?? {}) } as Record<string, any>;

          if (FILTERED.has(operation)) {
            noReassign(a.data);
            a.where = { AND: [a.where ?? {}, { organizationId }] };
          } else if (UNIQUE.has(operation)) {
            noReassign(a.data);
            a.where = { ...a.where, organizationId };
          } else if (operation === "create") {
            a.data = own(a.data);
          } else if (operation === "createMany") {
            a.data = Array.isArray(a.data) ? a.data.map(own) : own(a.data);
          } else if (operation === "upsert") {
            noReassign(a.update);
            a.where = { ...a.where, organizationId };
            a.create = own(a.create);
          } else {
            throw new Error(
              `Operation ${operation} is not allowed on tenant models`,
            );
          }
          return query(a);
        },
      },
    },
  });
}

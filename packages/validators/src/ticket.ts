import { z } from "zod";

export const ticketPriorities = [
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(20000).optional(),
  statusId: z.string().min(1).optional(),
  priority: z.enum(ticketPriorities).optional(),
  assigneeMemberId: z.string().min(1).optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200).optional(),
    description: z.string().max(20000).nullable().optional(),
    priority: z.enum(ticketPriorities).optional(),
    assigneeMemberId: z.string().min(1).nullable().optional(),
    dueDate: z.coerce.date().nullable().optional(),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {
      message: "Provide at least one field to change",
    },
  );

export const moveTicketSchema = z.object({
  statusId: z.string().min(1),
  afterTicketId: z.string().min(1).nullable(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type MoveTicketInput = z.infer<typeof moveTicketSchema>;

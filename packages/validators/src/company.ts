import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

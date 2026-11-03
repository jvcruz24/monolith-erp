import { BadRequestException } from "@nestjs/common";
import type { z } from "zod";

export function parseBody<T extends z.ZodType>(
  schema: T,
  body: unknown,
): z.output<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new BadRequestException(result.error.issues);
  }
  return result.data;
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createTicketSchema } from "@repo/validators";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useCreateTicket } from "@/lib/queries";

const quickAddSchema = createTicketSchema.pick({ title: true });
type QuickAddInput = z.infer<typeof quickAddSchema>;

export function QuickAdd({
  projectId,
  statusId,
  onClose,
}: {
  projectId: string;
  statusId: string;
  onClose: () => void;
}) {
  const create = useCreateTicket(projectId);
  const form = useForm<QuickAddInput>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, errors } = form.formState;

  async function onSubmit({ title }: QuickAddInput) {
    try {
      await create.mutateAsync({ title, statusId });
      form.reset();
      form.setFocus("title"); // stay ready for the next ticket
    } catch (error) {
      form.setError("root.server", {
        message:
          error instanceof Error
            ? error.message
            : "Could not create the ticket",
      });
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onKeyDown={(event) => event.key === "Escape" && onClose()}
      noValidate
      className="mt-2 flex flex-col gap-2"
    >
      <Input
        {...form.register("title")}
        placeholder="Ticket title"
        aria-label="Ticket title"
        aria-invalid={!!errors.title}
        autoComplete="off"
        autoFocus
      />
      {errors.title && (
        <p role="alert" className="text-caption text-error-text">
          {errors.title.message}
        </p>
      )}
      {errors.root?.server && (
        <p role="alert" className="text-caption text-error-text">
          {errors.root.server.message}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          Add
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, type CreateProjectInput } from "@repo/validators";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { FieldError, FieldGroup } from "@repo/ui/components/field";
import { TextField } from "@repo/ui/components/text-field";
import { useCreateProject, useProjects } from "@/lib/queries";

function NewProjectForm() {
  const create = useCreateProject();
  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", key: "" },
  });
  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: CreateProjectInput) {
    try {
      await create.mutateAsync(values);
      form.reset();
    } catch (error) {
      form.setError("root.server", {
        message:
          error instanceof Error
            ? error.message
            : "Could not create the project",
      });
    }
  }

  return (
    <Card className="w-full max-w-form">
      <CardHeader>
        <CardTitle>New project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <TextField
              control={form.control}
              name="name"
              label="Name"
              autoComplete="off"
            />
            <TextField
              control={form.control}
              name="key"
              label="Key"
              placeholder="ENG"
              autoComplete="off"
            />
            {errors.root?.server && (
              <FieldError errors={[errors.root.server]} />
            )}
            <Button type="submit" disabled={isSubmitting}>
              Create project
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProjectsView() {
  const { data: projects, isPending, error } = useProjects();

  return (
    <div className="mx-auto max-w-content px-gutter">
      <header className="pb-6">
        <p className="text-eyebrow text-fg-secondary">Projects</p>
        <h1 className="text-heading-md text-fg">Your projects</h1>
      </header>

      {isPending && <p className="text-ui-md text-fg-secondary">Loading…</p>}
      {error && (
        <p role="alert" className="text-ui-md text-error-text">
          {error.message}
        </p>
      )}

      {projects && projects.length === 0 && (
        <section className="pb-section">
          <p className="text-eyebrow text-fg-secondary">No projects yet</p>
          <h2 className="mt-2 text-display-lg text-fg">
            Start with one board.
          </h2>
        </section>
      )}

      {projects && projects.length > 0 && (
        <ul className="grid gap-4 pb-section sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong motion-reduce:transition-none"
              >
                <p className="text-eyebrow text-fg-secondary">{project.key}</p>
                <p className="mt-1 text-ui-label text-fg">{project.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <NewProjectForm />
    </div>
  );
}

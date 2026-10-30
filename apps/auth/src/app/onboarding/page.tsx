"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, type CreateCompanyInput } from "@repo/validators";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/button";
import { FieldError, FieldGroup } from "@repo/ui/components/field";
import { AuthShell } from "@/components/auth-shell";
import { TextField } from "@/components/text-field";
import { authClient } from "@/lib/auth-client";
import { makeSlug } from "@/lib/slug";

const KANBAN_URL = process.env.NEXT_PUBLIC_KANBAN_URL!;

export default function Onboarding() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: activeOrg, isPending: orgPending } =
    authClient.useActiveOrganization();

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: { name: "" },
  });
  const { isSubmitting, errors } = form.formState;

  useEffect(() => {
    if (isPending || orgPending) return;
    if (!session) router.replace("/sign-in?next=/onboarding");
    else if (activeOrg) router.replace("/");
  }, [isPending, orgPending, session, activeOrg, router]);

  async function onSubmit({ name }: CreateCompanyInput) {
    const { error } = await authClient.organization.create({
      name,
      slug: makeSlug(name),
    });
    if (error) {
      form.setError("root.server", {
        message: error.message ?? "Could not create the company",
      });
      return;
    }
    window.location.assign(KANBAN_URL);
  }

  if (isPending || !session) return null;

  return (
    <AuthShell
      title="Set up your company"
      description="You can invite your team after this."
      footer="Were you invited instead? Open the link from your invitation email."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            control={form.control}
            name="name"
            label="Company name"
            autoComplete="organization"
          />
          {errors.root?.server && <FieldError errors={[errors.root.server]} />}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create company"}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}

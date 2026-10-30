"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@repo/validators";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/button";
import { FieldError, FieldGroup } from "@repo/ui/components/field";
import { AuthShell } from "@/components/auth-shell";
import { TextField } from "@/components/text-field";
import { authClient } from "@/lib/auth-client";

export function SignUpForm({
  next,
  email: initialEmail,
}: {
  next: string;
  email: string;
}) {
  const router = useRouter();
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: initialEmail, password: "" },
  });
  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: SignUpInput) {
    const { error } = await authClient.signUp.email(values);
    if (error) {
      form.setError("root.server", {
        message: error.message ?? "Sign-up failed",
      });
      return;
    }
    router.push(next);
  }

  return (
    <AuthShell
      title="Create your account"
      footer={
        <span>
          Already registered?{" "}
          <Link
            className="underline underline-offset-4"
            href={`/sign-in?next=${encodeURIComponent(next)}`}
          >
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            control={form.control}
            name="name"
            label="Name"
            autoComplete="name"
          />
          <TextField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <TextField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          {errors.root?.server && <FieldError errors={[errors.root.server]} />}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}

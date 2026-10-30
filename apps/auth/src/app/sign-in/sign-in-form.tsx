"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@repo/validators";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/button";
import { FieldError, FieldGroup } from "@repo/ui/components/field";
import { AuthShell } from "@/components/auth-shell";
import { TextField } from "@/components/text-field";
import { authClient } from "@/lib/auth-client";

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: SignInInput) {
    const { error } = await authClient.signIn.email(values);
    if (error) {
      form.setError("root.server", {
        message: error.message ?? "Sign-in failed",
      });
      return;
    }
    router.push(next);
  }

  return (
    <AuthShell
      title="Sign in"
      footer={
        <span>
          No account?{" "}
          <Link
            className="underline underline-offset-4"
            href={`/sign-up?next=${encodeURIComponent(next)}`}
          >
            Create one
          </Link>
        </span>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
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
            autoComplete="current-password"
          />
          {errors.root?.server && <FieldError errors={[errors.root.server]} />}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  );
}

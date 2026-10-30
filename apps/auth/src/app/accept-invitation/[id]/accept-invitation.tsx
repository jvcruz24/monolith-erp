"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { AuthShell } from "@/components/auth-shell";
import { authClient } from "@/lib/auth-client";
import { activateFirstOrganization } from "@/lib/organization";

const KANBAN_URL = process.env.NEXT_PUBLIC_KANBAN_URL!;

export function AcceptInvitation({ id, email }: { id: string; email: string }) {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) return null;

  if (!session) {
    const next = encodeURIComponent(`/accept-invitation/${id}`);
    const emailParam = email ? `&email=${encodeURIComponent(email)}` : "";
    return (
      <AuthShell
        title="You have been invited"
        description="Create an account, or sign in, using the email address the invitation was sent to."
      >
        <div className="flex flex-col gap-2">
          <Link
            className={buttonVariants()}
            href={`/sign-up?next=${next}${emailParam}`}
          >
            Create account
          </Link>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/sign-in?next=${next}`}
          >
            Sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  async function accept() {
    setError(null);
    setBusy(true);
    const { error } = await authClient.organization.acceptInvitation({
      invitationId: id,
    });
    if (error) {
      setBusy(false);
      setError(error.message ?? "Could not accept the invitation");
      return;
    }
    await activateFirstOrganization();
    window.location.assign(KANBAN_URL);
  }

  return (
    <AuthShell
      title="Join the company"
      description={`Signed in as ${session.user.email}`}
    >
      <div className="flex flex-col gap-3">
        <Button onClick={accept} disabled={busy}>
          {busy ? "Joining…" : "Accept invitation"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </AuthShell>
  );
}

"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { authClient } from "@/lib/auth-client";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL!;

function Notice({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description?: string;
  href: string;
  action: string;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-form">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <a className={buttonVariants()} href={href}>
            {action}
          </a>
        </CardContent>
      </Card>
    </main>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();
  const { data: org, isPending: orgPending } =
    authClient.useActiveOrganization();

  if (isPending || orgPending) return null;

  if (!session) {
    return (
      <Notice
        title="Not signed in"
        href={`${PORTAL_URL}/sign-in`}
        action="Go to sign-in"
      />
    );
  }
  if (!org) {
    return (
      <Notice
        title="No company yet"
        description="Finish setting up to continue."
        href={PORTAL_URL}
        action="Continue setup"
      />
    );
  }

  async function signOut() {
    await authClient.signOut();
    queryClient.clear();
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 items-center justify-between border-b border-line-subtle px-gutter">
        <Link href="/" className="text-ui-label text-fg">
          {org.name}
        </Link>
        <Button variant="ghost" onClick={signOut}>
          Sign out
        </Button>
      </header>
      <main className="flex-1 py-6">{children}</main>
    </div>
  );
}

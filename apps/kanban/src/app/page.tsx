"use client";

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

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const { data: org, isPending: orgPending } =
    authClient.useActiveOrganization();

  if (isPending || orgPending) return null;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        {!session ? (
          <>
            <CardHeader>
              <CardTitle>Not signed in</CardTitle>
            </CardHeader>
            <CardContent>
              <a className={buttonVariants()} href={`${PORTAL_URL}/sign-in`}>
                Go to sign-in
              </a>
            </CardContent>
          </>
        ) : !org ? (
          <>
            <CardHeader>
              <CardTitle>No company yet</CardTitle>
              <CardDescription>Finish setting up to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <a className={buttonVariants()} href={PORTAL_URL}>
                Continue setup
              </a>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
              <CardDescription>
                Signed in as {session.user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => authClient.signOut()}>
                Sign out
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}

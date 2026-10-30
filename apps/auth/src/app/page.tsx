"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { activateFirstOrganization } from "@/lib/organization";

const KANBAN_URL = process.env.NEXT_PUBLIC_KANBAN_URL!;

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: activeOrg, isPending: orgPending } =
    authClient.useActiveOrganization();
  const started = useRef(false);

  useEffect(() => {
    if (isPending || orgPending || started.current) return;
    started.current = true;

    if (!session) {
      router.replace("/sign-in");
      return;
    }
    if (activeOrg) {
      window.location.assign(KANBAN_URL);
      return;
    }
    activateFirstOrganization().then((found) => {
      if (found) window.location.assign(KANBAN_URL);
      else router.replace("/onboarding");
    });
  }, [isPending, orgPending, session, activeOrg, router]);

  return <p>Loading…</p>;
}

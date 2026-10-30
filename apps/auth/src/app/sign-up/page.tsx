import { Suspense } from "react";
import { safeNext } from "@/lib/safe-next";
import { SignUpForm } from "./sign-up-form";

type SearchParams = Promise<{ next?: string | string[]; email?: string }>;

async function SignUpContent({ searchParams }: { searchParams: SearchParams }) {
  const { next, email } = await searchParams;
  return <SignUpForm next={safeNext(next)} email={email ?? ""} />;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={null}>
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  );
}

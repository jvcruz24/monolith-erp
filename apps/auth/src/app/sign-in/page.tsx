import { Suspense } from "react";
import { safeNext } from "@/lib/safe-next";
import { SignInForm } from "./sign-in-form";

type SearchParams = Promise<{ next?: string | string[] }>;

async function SignInContent({ searchParams }: { searchParams: SearchParams }) {
  const { next } = await searchParams;
  return <SignInForm next={safeNext(next)} />;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={null}>
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}

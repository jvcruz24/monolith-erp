import { Suspense } from "react";
import { AcceptInvitation } from "./accept-invitation";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ email?: string }>;

async function AcceptContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { email } = await searchParams;
  return <AcceptInvitation id={id} email={email ?? ""} />;
}

export default function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={null}>
      <AcceptContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

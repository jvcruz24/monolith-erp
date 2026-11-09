import { Suspense } from "react";
import { Board } from "@/components/board";

type Params = Promise<{ projectId: string }>;

async function BoardContent({ params }: { params: Params }) {
  const { projectId } = await params;
  return <Board projectId={projectId} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={null}>
      <BoardContent params={params} />
    </Suspense>
  );
}

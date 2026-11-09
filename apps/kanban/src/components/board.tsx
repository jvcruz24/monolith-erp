"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { useBoard } from "@/lib/queries";
import type { BoardStatus } from "@/lib/types";
import { QuickAdd } from "./quick-add";
import { TicketCard } from "./ticket-card";

function Column({
  status,
  projectId,
  adding,
  onOpen,
  onClose,
}: {
  status: BoardStatus;
  projectId: string;
  adding: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <section
      aria-label={status.name}
      className="flex w-5/6 shrink-0 snap-start flex-col self-start rounded-lg bg-subtle p-3 md:w-column"
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-ui-label text-fg">
          {status.name}
          <span className="ml-2 text-caption text-fg-secondary">
            {status.tickets.length}
          </span>
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 md:size-9"
          aria-label={`Add ticket to ${status.name}`}
          onClick={onOpen}
        >
          <Plus aria-hidden />
        </Button>
      </header>
      <ul className="flex flex-col gap-2">
        {status.tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </ul>
      {adding && (
        <QuickAdd
          projectId={projectId}
          statusId={status.id}
          onClose={onClose}
        />
      )}
    </section>
  );
}

function BoardSkeleton() {
  return (
    <div role="status" className="flex gap-4 overflow-hidden px-gutter">
      <span className="sr-only">Loading board</span>
      {[0, 1, 2].map((column) => (
        <div
          key={column}
          className="w-5/6 shrink-0 rounded-lg bg-subtle p-3 md:w-column"
        >
          <div className="mb-3 h-5 w-24 animate-pulse rounded-sm bg-line-subtle motion-reduce:animate-none" />
          {[0, 1].map((card) => (
            <div
              key={card}
              className="mb-2 h-20 animate-pulse rounded-lg bg-surface motion-reduce:animate-none"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Board({ projectId }: { projectId: string }) {
  const { data: board, isPending, error } = useBoard(projectId);
  const [addingIn, setAddingIn] = useState<string | null>(null);

  if (isPending) return <BoardSkeleton />;
  if (error || !board) {
    return (
      <p role="alert" className="px-gutter text-ui-md text-error-text">
        {error?.message ?? "Could not load the board."}
      </p>
    );
  }

  const total = board.statuses.reduce(
    (sum, status) => sum + status.tickets.length,
    0,
  );
  const first = board.statuses[0];

  return (
    <>
      <header className="px-gutter pb-6">
        <p className="text-eyebrow text-fg-secondary">{board.project.key}</p>
        <h1 className="text-heading-md text-fg">{board.project.name}</h1>
      </header>

      {total === 0 && first && (
        <section className="mx-auto max-w-form px-gutter pb-section text-center">
          <p className="text-eyebrow text-fg-secondary">No tickets yet</p>
          <h2 className="mt-2 text-display-lg text-fg">
            Start with one thing.
          </h2>
          <p className="mt-3 text-body-md text-fg-secondary">
            Create a ticket and it will appear here.
          </p>
          <Button className="mt-6" onClick={() => setAddingIn(first.id)}>
            New ticket
          </Button>
        </section>
      )}

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 md:snap-none">
        {board.statuses.map((status) => (
          <Column
            key={status.id}
            status={status}
            projectId={projectId}
            adding={addingIn === status.id}
            onOpen={() => setAddingIn(status.id)}
            onClose={() => setAddingIn(null)}
          />
        ))}
      </div>
    </>
  );
}

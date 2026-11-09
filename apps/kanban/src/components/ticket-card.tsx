import { Calendar, CalendarX } from "lucide-react";
import type { BoardTicket } from "@/lib/types";
import { PriorityIcon } from "./priority-icon";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

export function TicketCard({ ticket }: { ticket: BoardTicket }) {
  const due = ticket.dueDate ? new Date(ticket.dueDate) : null;
  const overdue = due !== null && due < new Date() && !ticket.completedAt;
  const DueIcon = overdue ? CalendarX : Calendar;

  return (
    <li className="rounded-lg border border-line bg-surface p-3 transition-colors hover:border-line-strong motion-reduce:transition-none">
      <p className="text-data-md text-fg-secondary">{ticket.key}</p>
      <p className="mt-1 line-clamp-3 text-ui-md text-fg">{ticket.title}</p>
      <div className="mt-3 flex items-center gap-3 text-caption text-fg-secondary">
        <PriorityIcon priority={ticket.priority} />
        {due && (
          <span
            className={`inline-flex items-center gap-1 ${overdue ? "text-error-text" : ""}`}
          >
            <DueIcon className="size-3.5" aria-hidden />
            {dateFormat.format(due)}
            {overdue && <span className="sr-only"> (overdue)</span>}
          </span>
        )}
      </div>
    </li>
  );
}

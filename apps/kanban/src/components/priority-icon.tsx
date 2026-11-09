import {
  ArrowDown,
  ArrowUp,
  Equal,
  Minus,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { Priority } from "@/lib/types";

const PRIORITIES: Record<
  Priority,
  { label: string; icon: LucideIcon; className: string }
> = {
  URGENT: {
    label: "Urgent",
    icon: TriangleAlert,
    className: "text-error-text",
  },
  HIGH: { label: "High", icon: ArrowUp, className: "text-warning-text" },
  MEDIUM: { label: "Medium", icon: Equal, className: "text-info-text" },
  LOW: { label: "Low", icon: ArrowDown, className: "text-fg-secondary" },
  NONE: { label: "No priority", icon: Minus, className: "text-fg-tertiary" },
};

export function PriorityIcon({ priority }: { priority: Priority }) {
  const { label, icon: Icon, className } = PRIORITIES[priority];
  return (
    <span className={className} title={label}>
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">
        {label}
        {priority === "NONE" ? "" : " priority"}
      </span>
    </span>
  );
}

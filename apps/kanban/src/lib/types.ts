export type Priority = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type StatusCategory = "TODO" | "IN_PROGRESS" | "DONE";

export type Project = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  archivedAt: string | null;
  createdAt: string;
};

export type BoardTicket = {
  id: string;
  number: number;
  key: string;
  title: string;
  priority: Priority;
  position: number;
  statusId: string;
  assigneeMemberId: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type BoardStatus = {
  id: string;
  name: string;
  category: StatusCategory;
  position: number;
  color: string | null;
  tickets: BoardTicket[];
};

export type Board = {
  project: { id: string; key: string; name: string };
  statuses: BoardStatus[];
};

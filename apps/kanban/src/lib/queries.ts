import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectInput } from "@repo/validators";
import { api } from "./api";
import type { Board, Project } from "./types";

export const projectsKey = ["projects"] as const;
export const boardKey = (projectId: string) => ["board", projectId] as const;

export function useProjects() {
  return useQuery({
    queryKey: projectsKey,
    queryFn: () => api.get<Project[]>("/projects"),
  });
}

export function useBoard(projectId: string) {
  return useQuery({
    queryKey: boardKey(projectId),
    queryFn: () => api.get<Board>(`/projects/${projectId}/board`),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      api.post<Project>("/projects", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKey }),
  });
}

export function useCreateTicket(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; statusId?: string }) =>
      api.post(`/projects/${projectId}/tickets`, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: boardKey(projectId) }),
  });
}

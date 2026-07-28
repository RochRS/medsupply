import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { requestsResponseSchema, singleRequestResponseSchema, createRequestInputSchema } from "../schemas/requests";
import type { RequestItem, CreateRequestInput } from "../schemas/requests";

export function useRequests() {
  return useQuery<RequestItem[]>({
    queryKey: ["requests"],
    queryFn: async () => {
      const data = await apiFetch("/requests");
      return requestsResponseSchema.parse(data).requests;
    },
  });
}

export function useRequest(id: number) {
  return useQuery<RequestItem | null>({
    queryKey: ["requests", id],
    queryFn: async () => {
      const data = await apiFetch(`/requests/${id}`);
      const parsed = singleRequestResponseSchema.parse(data);
      return parsed.request;
    },
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRequestInput) => {
      createRequestInputSchema.parse(input);
      return apiFetch("/requests", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useSendUrgentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRequestInput) => {
      createRequestInputSchema.parse(input);
      return apiFetch("/requests?urgent=1", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
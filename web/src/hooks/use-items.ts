import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { itemsResponseSchema, itemsSummarySchema, itemDetailResponseSchema } from "../schemas/items";
import type { Item } from "../schemas/items";

export function useUrgentItems() {
  return useQuery<Item[]>({
    queryKey: ["items", "urgent"],
    queryFn: async () => {
      const data = await apiFetch("/items?isUrgent=true");
      return itemsResponseSchema.parse(data).items;
    },
  });
}

export function useCriticalItems() {
  return useQuery<Item[]>({
    queryKey: ["items", "critical"],
    queryFn: async () => {
      const data = await apiFetch("/items?status=critical");
      return itemsResponseSchema.parse(data).items;
    },
  });
}

export function useLowStockItems() {
  return useQuery<Item[]>({
    queryKey: ["items", "low-stock"],
    queryFn: async () => {
      const data = await apiFetch("/items?status=low");
      return itemsResponseSchema.parse(data).items;
    },
  });
}

export function useAllItems(search?: string) {
  return useQuery<{ items: Item[]; summary?: { totalItems: number; totalStock: number; criticalStock: number; lowStock: number } }>({
    queryKey: ["items", "all", search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const data = await apiFetch(`/items${params}`);
      if (data.summary) {
        const parsed = itemsSummarySchema.parse(data);
        return { items: parsed.items, summary: parsed.summary };
      }
      const parsed = itemsResponseSchema.parse(data);
      return { items: parsed.items };
    },
  });
}

export function useItem(id: number) {
  return useQuery<Item | null>({
    queryKey: ["items", id],
    queryFn: async () => {
      const data = await apiFetch(`/items/${id}`);
      const parsed = itemDetailResponseSchema.parse(data);
      return parsed.item;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { itemName: string; remainingAmount: number; description?: string; categoryId?: number }) =>
      apiFetch("/items", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/items/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
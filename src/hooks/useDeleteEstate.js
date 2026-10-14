"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteEstate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (estateId) => {
      const response = await fetch(`/api/estates/${estateId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در حذف ملک");
      }

      return result;
    },

  });
}

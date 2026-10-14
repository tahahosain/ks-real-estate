"use client";

import { useMutation } from "@tanstack/react-query";

export default function useReconsiderEstate() {
  return useMutation({
    mutationFn: async (estateId) => {
      const response = await fetch(`/api/estates/${estateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "reconsider",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "بازگرداندن ملک به صف بررسی انجام نشد",
        );
      }

      return result;
    },
  });
}

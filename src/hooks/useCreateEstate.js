"use client";

import { useMutation } from "@tanstack/react-query";

export default function useCreateEstate() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/estates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در ثبت ملک");
      }

      return result;
    },
  });
}

"use client";

import { useMutation } from "@tanstack/react-query";

export default function useUpdateUser() {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ویرایش کاربر انجام نشد");
      }

      return result;
    },
  });
}

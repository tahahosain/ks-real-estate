"use client";

import { useMutation } from "@tanstack/react-query";

const useDeleteContact = () => {
  return useMutation({
    mutationFn: async (messageId) => {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در حذف پیام");
      }

      return result;
    },
  });
};

export default useDeleteContact;

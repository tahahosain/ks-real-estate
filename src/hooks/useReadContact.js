"use client";

import { useMutation } from "@tanstack/react-query";

const useReadContact = () => {
  return useMutation({
    mutationFn: async (messageId) => {
      const response = await fetch(`/api/contact/${messageId}/read`, {
        method: "PATCH",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در تغییر وضعیت پیام");
      }

      return result;
    },
  });
};

export default useReadContact;

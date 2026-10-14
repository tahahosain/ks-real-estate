"use client";

import { useMutation } from "@tanstack/react-query";

const useUpdateContact = () => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در ویرایش پیام");
      }

      return result;
    },
  });
};

export default useUpdateContact;

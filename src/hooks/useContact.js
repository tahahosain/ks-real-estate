"use client";

import { useMutation } from "@tanstack/react-query";

const useContact = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در ارسال پیام");
      }

      return result;
    },
  });
};

export default useContact;

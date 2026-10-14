"use client";

import { useQuery } from "@tanstack/react-query";

const useContactMessages = () => {
  return useQuery({
    queryKey: ["contactMessagesCount"],

    queryFn: async () => {
      const response = await fetch("/api/contact", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در دریافت تعداد پیام‌ها");
      }

      return result.count;
    },
  });
};

export default useContactMessages;

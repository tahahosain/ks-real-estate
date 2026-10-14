"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchSimilarEstates(id) {
  const response = await fetch(`/api/estates/similar?id=${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "خطا در دریافت املاک مشابه");
  }

  return result;
}

export default function useSimilarEstates(id) {
  return useQuery({
    queryKey: ["similar-estates", id],
    queryFn: () => fetchSimilarEstates(id),
    enabled: Boolean(id),
  });
}

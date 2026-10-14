"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await fetch("/api/wishlist", {
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در دریافت علاقه‌مندی‌ها");
      }

      return result.favorites;
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (estateId) => {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          estate: estateId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در افزودن علاقه‌مندی");
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (estateId) => {
      const response = await fetch(`/api/wishlist/${estateId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در حذف علاقه‌مندی");
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  const favorites = data || [];

  const toggleFavorite = (estateId) => {
    if (!estateId) return;

    if (favorites.includes(estateId)) {
      removeFavoriteMutation.mutate(estateId);
    } else {
      addFavoriteMutation.mutate(estateId);
    }
  };

  const isFavorite = (estateId) => {
    if (!estateId) return false;

    return favorites.includes(estateId);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoading,
    isUpdating:
      addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
};

export default useFavorites;

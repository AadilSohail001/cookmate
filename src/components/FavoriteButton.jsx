"use client";

import { Heart } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/utils/cn";

export function FavoriteButton({ recipeId, className }) {
  const [favoriteIds, setFavoriteIds] = useLocalStorage("favorites", []);

  const isFavorite = favoriteIds.includes(recipeId);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteIds(
      isFavorite
        ? favoriteIds.filter((id) => id !== recipeId)
        : [...favoriteIds, recipeId]
    );
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-full p-2 transition-colors",
        isFavorite
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/80 text-zinc-600 hover:bg-white hover:text-red-500",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
    </button>
  );
}

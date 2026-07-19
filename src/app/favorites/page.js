"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { recipes } from "@/data/recipes";
import { RecipeGrid } from "@/components/RecipeGrid";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favoriteIds] = useLocalStorage("favorites", []);
  const favoriteRecipes = recipes.filter((r) => favoriteIds.includes(r.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-zinc-900 dark:text-white">
          <Heart className="h-7 w-7 text-red-500 fill-red-500" />
          My Favorites
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          {favoriteRecipes.length} saved recipe{favoriteRecipes.length !== 1 ? "s" : ""}
        </p>
      </div>
      <RecipeGrid
        recipes={favoriteRecipes}
        emptyMessage="You haven't saved any recipes yet. Browse recipes and click the heart icon to save them!"
      />
    </div>
  );
}

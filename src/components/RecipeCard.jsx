"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat, Star } from "lucide-react";
import { Badge } from "./Badge";
import { FavoriteButton } from "./FavoriteButton";

export function RecipeCard({ recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-orange-300 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:ring-orange-700"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute right-2 top-2">
          <FavoriteButton recipeId={recipe.id} />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="primary">{recipe.category}</Badge>
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>{recipe.rating}</span>
          </div>
        </div>
        <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {recipe.cookingTime} min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5" />
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat, Star, Target, SearchX } from "lucide-react";

function RecipeMatchCard({ recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group relative block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-orange-300 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:ring-orange-700"
    >
      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 240px"
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
          <Target className="h-3 w-3" />
          {recipe.matchScore}%
        </div>
      </div>
      <div className="p-3">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {recipe.cookingTime} min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5" />
            {recipe.difficulty}
          </span>
          <span className="ml-auto flex items-center gap-1 text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            {recipe.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RecipeToolResult({ data }) {
  const recipes = data?.recipes ?? [];

  if (recipes.length === 0) {
    return (
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
          <SearchX className="mx-auto h-8 w-8 text-zinc-400" />
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            No matching recipes found
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Try different ingredients or ask the AI chef for ideas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 px-1 pb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
          🍳
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Recipe Matches</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {recipes.length} recipe{recipes.length > 1 ? "s" : ""} found
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeMatchCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

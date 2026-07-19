"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { recipes } from "@/data/recipes";
import { RecipeGrid } from "@/components/RecipeGrid";
import { SearchBar } from "@/components/SearchBar";

export function RecipeList() {
  const searchParams = useSearchParams();
  const raw = searchParams?.get("search") || "";
  const search = raw.toLowerCase();

  const filtered = useMemo(
    () =>
      search
        ? recipes.filter(
            (r) =>
              r.title.toLowerCase().includes(search) ||
              r.description.toLowerCase().includes(search) ||
              r.category.toLowerCase().includes(search)
          )
        : recipes,
    [search]
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">All Recipes</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <SearchBar className="w-full sm:w-72" initialValue={raw} />
      </div>
      <RecipeGrid recipes={filtered} />
    </>
  );
}

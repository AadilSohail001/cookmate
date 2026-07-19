"use client";

import { featuredRecipes, popularRecipes } from "@/data/recipes";
import { categories } from "@/data/categories";
import { RecipeCard } from "./RecipeCard";
import { CategoryCard } from "./CategoryCard";
import { Button } from "./Button";
import Link from "next/link";

export function FeaturedSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Featured Recipes</h2>
        <Link href="/recipes">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Categories</h2>
        <Link href="/categories">
          <Button variant="ghost" size="sm">Browse All</Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}

export function PopularSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Popular Recipes</h2>
        <Link href="/recipes">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {popularRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

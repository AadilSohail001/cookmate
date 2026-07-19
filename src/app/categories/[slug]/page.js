import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { recipes } from "@/data/recipes";
import { categories } from "@/data/categories";
import { RecipeGrid } from "@/components/RecipeGrid";

export const metadata = {
  title: "Category - CookMate",
};

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryRecipes = recipes.filter((r) => r.category === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/categories" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-orange-500 dark:text-zinc-400">
        <ArrowLeft className="h-4 w-4" /> All Categories
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{category.name}</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          {categoryRecipes.length} recipe{categoryRecipes.length !== 1 ? "s" : ""}
        </p>
      </div>
      <RecipeGrid recipes={categoryRecipes} emptyMessage={`No recipes in ${category.name} yet.`} />
    </div>
  );
}

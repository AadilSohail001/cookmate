import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { recipes } from "@/data/recipes";

export const metadata = {
  title: "Categories - CookMate",
};

export default function CategoriesPage() {
  const recipeCounts = categories.reduce((acc, cat) => {
    acc[cat.slug] = recipes.filter((r) => r.category === cat.slug).length;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Categories</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Browse recipes by category
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}

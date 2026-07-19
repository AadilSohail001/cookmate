import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ChefHat, Users, ArrowLeft } from "lucide-react";
import { recipes } from "@/data/recipes";
import { Badge } from "@/components/Badge";
import { FavoriteButton } from "@/components/FavoriteButton";

export const metadata = {
  title: "Recipe Details - CookMate",
};

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) notFound();

  const { title, image, category, cookingTime, difficulty, servings, ingredients, instructions, nutrition, description, rating } = recipe;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/recipes" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-orange-500 dark:text-zinc-400">
        <ArrowLeft className="h-4 w-4" /> Back to Recipes
      </Link>

      <div className="relative mb-8 h-64 overflow-hidden rounded-xl sm:h-80 lg:h-96">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" priority />
      </div>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="primary">{category}</Badge>
          <span className="text-sm text-yellow-500">&#9733; {rating}</span>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">{title}</h1>
          <FavoriteButton recipeId={recipe.id} className="h-10 w-10" />
        </div>
        <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">{description}</p>

        <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500" /> {cookingTime} minutes</span>
          <span className="flex items-center gap-2"><ChefHat className="h-4 w-4 text-orange-500" /> {difficulty}</span>
          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-orange-500" /> {servings} servings</span>
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Ingredients</h2>
          <ul className="space-y-2">
            {ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Instructions</h2>
          <ol className="space-y-4">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-zinc-700 dark:text-zinc-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Nutrition Facts</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-white p-4 dark:bg-zinc-800">
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{nutrition.calories}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Calories</p>
          </div>
          <div className="rounded-lg bg-white p-4 dark:bg-zinc-800">
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{nutrition.protein}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Protein</p>
          </div>
          <div className="rounded-lg bg-white p-4 dark:bg-zinc-800">
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{nutrition.carbs}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Carbs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

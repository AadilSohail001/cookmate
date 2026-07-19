import { Suspense } from "react";
import { RecipeList } from "./RecipeList";
import { Loader } from "@/components/Loader";

export const metadata = {
  title: "All Recipes - CookMate",
};

export default function RecipesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<Loader />}>
        <RecipeList />
      </Suspense>
    </div>
  );
}

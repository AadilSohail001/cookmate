"use client";

import { User, Mail, Calendar, ChefHat, Heart, BookOpen } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { recipes } from "@/data/recipes";

export default function ProfilePage() {
  const [favoriteIds] = useLocalStorage("favorites", []);
  const savedCount = recipes.filter((r) => favoriteIds.includes(r.id)).length;
  const uniqueCategories = new Set(recipes.filter((r) => favoriteIds.includes(r.id)).map((r) => r.category)).size;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl font-bold text-orange-600 dark:bg-orange-900 dark:text-orange-300">
          CM
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">CookMate User</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Home Cook & Recipe Enthusiast</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-zinc-50 p-4 text-center dark:bg-zinc-900">
          <Heart className="mx-auto mb-2 h-6 w-6 text-red-500" />
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{savedCount}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Saved Recipes</p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4 text-center dark:bg-zinc-900">
          <ChefHat className="mx-auto mb-2 h-6 w-6 text-orange-500" />
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{uniqueCategories}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Categories</p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4 text-center dark:bg-zinc-900">
          <BookOpen className="mx-auto mb-2 h-6 w-6 text-blue-500" />
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{recipes.length}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Recipes</p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Account Details</h2>
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <User className="h-4 w-4" /> Username: cookmate_user
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <Mail className="h-4 w-4" /> Email: user@cookmate.app
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <Calendar className="h-4 w-4" /> Member since: 2025
        </div>
      </div>
    </div>
  );
}

import { recipes, getRecipeById, getRecipesByCategory, searchRecipes } from "@/data/recipes";
import { categories } from "@/data/categories";

export const recipeService = {
  getAll: () => recipes,
  getById: (id) => getRecipeById(id),
  getByCategory: (slug) => getRecipesByCategory(slug),
  search: (query) => searchRecipes(query),
  getCategories: () => categories,
  getCategoryBySlug: (slug) => categories.find((c) => c.slug === slug),
};

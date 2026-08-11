import { z } from "zod";
import { recipes } from "@/data/recipes";

export const searchRecipesSchema = z.object({
  ingredients: z.array(z.string()).min(1).max(20),
});

const STOPWORDS =
  /\b(1\/2|1\/4|1\/3|2\/3|3\/4|cups?|tbsp|tablespoons?|tsps?|teaspoons?|oz|ounces?|lbs?|pounds?|cloves?|packets?|slices?|cans?|bunches?|pinch(?:es)?|sticks?|bags?|dash(?:es)?|to|of|and|fresh|a|an)\b/g;

function clean(ingredient) {
  return ingredient
    .toLowerCase()
    .replace(/\d+\s*\/\s*\d+/g, " ")
    .replace(/\d+/g, " ")
    .replace(STOPWORDS, " ")
    .replace(/[^a-z ]/g, " ")
    .trim();
}

function stem(word) {
  return word.replace(/ies$/, "y").replace(/oes$/, "o").replace(/(es|s)$/, "");
}

const MIN_SCORE = 30;
const MAX_RESULTS = 8;

export function searchRecipes(input) {
  const { ingredients } = searchRecipesSchema.parse(input);

  const query = ingredients.map((ing) => {
    const cleaned = clean(ing);
    const words = cleaned.split(" ").filter((w) => w.length >= 3);
    return words.map(stem);
  });

  const matches = recipes
    .map((recipe) => {
      const recipeTokens = recipe.ingredients.map((ing) =>
        clean(ing).split(" ").filter((w) => w.length >= 3).map(stem)
      );

      let matched = 0;
      const matchedIngredients = [];
      for (const queryWords of query) {
        const hit = recipeTokens.some((recipeWords) =>
          queryWords.some((qw) =>
            recipeWords.some((rw) => rw.includes(qw) || qw.includes(rw))
          )
        );
        if (hit) {
          matched++;
          matchedIngredients.push(queryWords.join(" "));
        }
      }

      if (matched === 0) return null;

      // Two-way coverage: how many of the user's ingredients are used AND
      // how much of the recipe those ingredients cover. A recipe that only
      // happens to share one garnish ingredient scores low and is dropped.
      const userCoverage = matched / query.length;
      const recipeCoverage = matched / recipe.ingredients.length;
      const matchScore = Math.round(
        50 * userCoverage + 50 * recipeCoverage
      );

      if (matchScore < MIN_SCORE) return null;

      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        category: recipe.category,
        matchScore,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        rating: recipe.rating,
        matchedIngredients,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore || a.cookingTime - b.cookingTime)
    .slice(0, MAX_RESULTS);

  return { recipes: matches, query: ingredients };
}

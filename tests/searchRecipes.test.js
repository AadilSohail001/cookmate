import { describe, it, expect } from "vitest";
import { searchRecipes } from "@/lib/tools/searchRecipes";

function titles(input) {
  return searchRecipes(input).recipes.map((r) => `${r.title}:${r.matchScore}`);
}

describe("searchRecipes", () => {
  it("ranks recipes by ingredient coverage", () => {
    const t = titles({ ingredients: ["eggs", "tomatoes", "cheese"] });
    expect(t[0]).toMatch(/^Spaghetti Carbonara:/);
    expect(t[0]).toContain("Carbonara");
  });

  it("excludes recipes with a single garnish match", () => {
    const t = titles({ ingredients: ["eggs", "tomatoes", "cheese"] });
    expect(t.some((x) => x.startsWith("Chocolate Lava Cake"))).toBe(false);
  });

  it("returns dessert for chocolate-based queries", () => {
    const t = titles({ ingredients: ["flour", "chocolate", "butter"] });
    expect(t[0]).toMatch(/^Chocolate Lava Cake:/);
  });

  it("returns partial matches when no recipe has every ingredient", () => {
    const t = titles({ ingredients: ["eggs", "tomatoes"] });
    expect(t.length).toBeGreaterThan(0);
    expect(t.length).toBeLessThanOrEqual(8);
  });

  it("returns seafood for shrimp and garlic", () => {
    const t = titles({ ingredients: ["shrimp", "garlic"] });
    expect(t.some((x) => x.startsWith("Lemon Garlic Shrimp") || x.startsWith("Garlic Butter Shrimp Pasta"))).toBe(true);
  });

  it("returns empty for nonsense queries", () => {
    expect(searchRecipes({ ingredients: ["unicorn tears"] }).recipes).toEqual([]);
  });

  it("matches recipes by title", () => {
    const t = titles({ ingredients: ["greek salad"] });
    expect(t.some((x) => x.startsWith("Greek Salad"))).toBe(true);
  });

  it("caps results at 8 and keeps scores >= 30", () => {
    const results = searchRecipes({ ingredients: ["egg"] }).recipes;
    expect(results.length).toBeLessThanOrEqual(8);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.matchScore >= 30)).toBe(true);
  });

  it("sorts results descending by match score", () => {
    const results = searchRecipes({ ingredients: ["egg"] }).recipes;
    expect(results.every((r, i) => i === 0 || results[i - 1].matchScore >= r.matchScore)).toBe(true);
  });

  it("includes matchedIngredients on every result", () => {
    const results = searchRecipes({ ingredients: ["egg"] }).recipes;
    expect(results.every((r) => r.matchedIngredients.length > 0)).toBe(true);
  });

  it("rejects empty ingredient lists", () => {
    expect(() => searchRecipes({ ingredients: [] })).toThrow();
  });

  it("returns the expected result shape", () => {
    const result = searchRecipes({ ingredients: ["eggs", "tomatoes"] });
    const recipe = result.recipes[0];
    expect(result.query).toEqual(["eggs", "tomatoes"]);
    expect(recipe).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      image: expect.any(String),
      category: expect.any(String),
      matchScore: expect.any(Number),
      cookingTime: expect.any(Number),
      difficulty: expect.any(String),
      rating: expect.any(Number),
      matchedIngredients: expect.any(Array),
    });
  });
});
import { ChefHat, Heart, Sparkles } from "lucide-react";

export const metadata = {
  title: "About - CookMate",
};

export default function AboutPage() {
  const features = [
    {
      icon: ChefHat,
      title: "Curated Recipes",
      description: "Hand-picked recipes from around the world, tested and perfected for your kitchen.",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Build your personal collection of go-to recipes and access them anytime.",
    },
    {
      icon: Sparkles,
      title: "Easy to Follow",
      description: "Step-by-step instructions with clear ingredients and cooking times for every recipe.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">About CookMate</h1>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          Your ultimate recipe companion. Discover, cook, and share delicious recipes from around the world.
        </p>
      </div>

      <div className="mb-12 space-y-4 text-zinc-600 dark:text-zinc-400">
        <p>
          CookMate was created with a simple mission: make cooking accessible and enjoyable for everyone. Whether you are a
          seasoned chef or a beginner in the kitchen, our platform helps you find the perfect recipe for any occasion.
        </p>
        <p>
          We believe that good food brings people together. Our collection spans breakfast, lunch, dinner, desserts, and
          more — with clear instructions, accurate cooking times, and nutritional information for every dish.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-xl bg-zinc-50 p-6 text-center dark:bg-zinc-900">
            <feature.icon className="mx-auto mb-3 h-8 w-8 text-orange-500" />
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

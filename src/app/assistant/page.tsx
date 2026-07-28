import { Chat } from "@/components/Chat";

export const metadata = {
  title: "AI Chef Assistant - CookMate",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">AI Chef Assistant</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ask for recipes, cooking tips, ingredient substitutions, or meal ideas.
        </p>
      </div>
      <Chat />
    </div>
  );
}
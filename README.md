# CookMate 🍳

A modern recipe discovery platform built with Next.js (App Router), Tailwind CSS, and React.

## Features

- Browse recipes by category (Breakfast, Lunch, Dinner, Desserts, etc.)
- Search recipes by name, ingredients, or description
- View detailed recipe information (ingredients, instructions, nutrition)
- Save favorite recipes (localStorage)
- Dark mode support
- Responsive design
- System health monitoring page

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** JavaScript
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/           # App Router pages
├── components/    # Reusable UI components
├── constants/     # Site config and navigation
├── data/          # Recipe and category data
├── hooks/         # Custom React hooks
├── services/      # Data services
└── utils/         # Utility functions
```

## Build

```bash
npm run build
```

## AI Chef Assistant

The AI Chef (`/assistant`) is a streaming chatbot powered by the [OpenRouter API](https://openrouter.ai) (`openai/gpt-4o-mini` by default). Set your API key in `.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

It supports tool calling: when you describe ingredients you have, the assistant calls the `searchRecipes` tool and renders the results as real recipe cards in the chat (generative UI).

## AI Tools

### searchRecipes

Searches the CookMate recipe database based on user-provided ingredients and returns recipes ranked by ingredient match score.

- **File:** `src/lib/tools/searchRecipes.js`
- **Input validation:** Zod schema (`searchRecipesSchema`)
- **Data source:** `src/data/recipes.js`

#### Input Schema

```json
{
  "ingredients": ["string"]
}
```

#### Example Input

```json
{
  "ingredients": ["eggs", "tomatoes", "cheese"]
}
```

#### Return Shape

```json
{
  "recipes": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "category": "string",
      "matchScore": "number",
      "cookingTime": "number",
      "difficulty": "string",
      "rating": "number",
      "matchedIngredients": ["string"]
    }
  ],
  "query": ["string"]
}
```

#### Tool Lifecycle

The chat UI renders four distinct states while the tool runs:

| State | Visual treatment | UI component |
| --- | --- | --- |
| 1. Input Streaming | Spinner + partial tool arguments | `ToolStatus` (`status="streaming"`) |
| 2. Input Available | "Searching CookMate recipes" + ingredient chips | `ToolStatus` (`status="running"`) |
| 3. Output Available | Recipe cards with match %, time, difficulty | `RecipeToolResult` |
| 4. Output Error | Error card with "Try Again" button | `ToolStatus` (`status="error"`) |

Stream markers between server and client: `<<<TOOL_STREAM>>>`, `<<<TOOL_RUN>>>`, `<<<TOOL_RESULT>>>`, `<<<TOOL_ERROR>>>` followed by their JSON payloads.


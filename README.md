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

- **API key:** `OPENROUTER_API_KEY` (falls back to `GEMINI_API_KEY` if unset)
- **Fallback behavior:** if no recipe in the CookMate library matches, the assistant says so honestly and then provides a complete classic recipe (ingredients, quantities, numbered steps, servings, time) from its own cooking knowledge — it never invents fake match scores or claims its own recipe is from CookMate.
- **Concise summaries:** matched recipes are displayed as cards automatically, so the assistant keeps its text reply to 1–3 sentences naming the top 1–2 recipes and never repeats the recipe list as markdown.

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

#### Matching & Scoring

- Ingredient queries are cleaned (stopwords, quantities, units stripped) and stemmed.
- Recipes score with two-way coverage: `50 * userCoverage + 50 * recipeCoverage`.
- `MIN_SCORE = 30`, `MAX_RESULTS = 8`, results sorted by score then cooking time.

#### Streaming Protocol

The server emits typed markers followed by their JSON payloads, each terminated with an end marker. Markers may be split across network chunks, so the client parser (`src/components/Chat.tsx`) buffers partial markers — including trailing `<` characters — until a full segment is received.

- `<<<TOOL_STREAM>>>` — streaming tool arguments (may repeat)
- `<<<TOOL_RUN>>>` — validated tool input
- `<<<TOOL_RESULT>>>` — search results (or empty list)
- `<<<TOOL_ERROR>>>` — tool failure
- `<<<END>>>` — payload terminator

#### Error Handling & Testing

- `src/app/error.tsx` global error boundary, `src/app/assistant/loading.tsx` skeleton, `WelcomeState` first-run empty state, and `ErrorNotice` cards for network / rate-limit / interrupted / API / unknown errors.
- Dev-only sabotage params on `/api/chat` (`NODE_ENV !== "production"`): `?sabotage=slow|error|rate-limit|midstream|empty`.


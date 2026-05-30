# Shortlist IQ

Shortlist IQ is a full-stack car research web application that helps buyers go from “I don’t know what to buy” to a confident shortlist of cars.

## Tech stack

- Next.js (App Router, TypeScript)
- React 18
- Prisma ORM
- SQLite
- Tailwind CSS

## Features

- Free-text preference input (brand, mileage, safety, budget, etc.)
- Deterministic scoring engine over a small in-repo car dataset
- Ranked recommendations with “Why this car?” explanations
- Select and save shortlists with shareable URLs
- SQLite + Prisma with seed script; no external services required
- Optional Kaggle CSV import for richer datasets (not required for evaluation)

## Prerequisites

- Node.js 18+ installed on your machine
- npm (comes with Node)

## How to run locally (macOS)

1. **Clone or create the project**

   ```bash
   git clone <your-repo-url> shortlist-iq
   cd shortlist-iq
   ```

   Or if you created it locally already, just `cd` into the folder.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Ensure a `.env` file exists in the project root with:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Set up database schema and seed data**

   ```bash
   npx prisma generate
   npm run db:setup
   ```

   This will:

   - Create/update the SQLite schema (`Car` and `Shortlist` tables).
   - Seed ~20 sample cars into the `Car` table.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Go to:

   - http://localhost:3000

## Usage

1. On the home page, describe your preferences (brand, safety, mileage, budget).
2. Optionally set min and max budget.
3. Click **“Get my shortlist”**.
4. Review the recommended cars:
   - Make, model, price, mileage, safety rating, power, fuel, transmission.
   - One-line explanation “Why this car”.
5. Tick the checkboxes for cars to add to your shortlist.
6. Click **“Save shortlist”**:
   - You will be redirected to `/shortlist/[slug]`.
   - The URL is shareable and shows your original query and selected cars.

## Optional: Import a Kaggle dataset

This is **not required** to run the app or for evaluation. It’s just an enhancement.

1. Place your Kaggle CSV at:

   ```text
   data/cars_kaggle.csv
   ```

2. Adjust `scripts/import-kaggle.ts` to match your CSV column names if needed.
3. Run:

   ```bash
   npm run import:kaggle
   ```

   This will clear the existing cars and shortlists and repopulate the `Car` table from the CSV.

To reset back to the default small dataset, run:

```bash
npm run seed
```

## Optional: LLM integration

The app is designed to work with a deterministic parser by default. If you later add an LLM endpoint:

- Add to `.env`:

  ```env
  LLM_API_KEY="your-api-key"
  LLM_API_URL="https://your-llm-endpoint"
  ```

- Implement the LLM call inside `lib/recommendation/parseIntent.ts` in `parseIntentWithLLM`.

If the LLM call fails or is not configured, the deterministic parser is always used.

## Deploying to Vercel (optional)

1. Push this repository to GitHub.
2. In the Vercel dashboard:
   - Import the repo.
   - Set environment variables:
     - `DATABASE_URL="file:./prisma/dev.db"`
   - Optionally `LLM_API_KEY` and `LLM_API_URL`.
3. Vercel will run `npm install`, `npm run build`, and then host the app.

For local assessment, only steps up to `npm run dev` are needed.
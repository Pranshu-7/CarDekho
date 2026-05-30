# NextDrive

NextDrive is a car recommendation app that suggests cars based on a user’s real preferences: budget, safety, mileage, performance, and affinity for specific brands. The focus is on how people actually shop for cars in India—most buyers (including me) start from “I trust these brands” and “this is my budget and use case,” not from raw specs. The system takes that natural preference input and turns it into scores to rank cars.

---

## What did you build and why? What did you deliberately cut?

I built **NextDrive**, an intent‑based car recommendation app. Users describe what they care about (budget, safety, mileage, performance, brand preferences), and the backend converts that into numeric weights to rank cars from a small curated catalog. The goal is to feel closer to how a friend or salesperson would think about your needs, rather than just showing a giant table of specs.

Deliberately, I did not build:

- Complex infrastructure (microservices, queues, background workers, etc.)
- Authentication or user accounts
- A flashy, highly animated UI
- Heavy ML/AI models or LLM integration in the core recommendation flow

The goal was to ship a clean, end‑to‑end recommendation flow that is easy to understand and review, rather than an over‑engineered system.

---

## Tech stack and why

**Tech stack:**

- **Next.js (App Router) + React** for frontend and backend in a single codebase
- **TypeScript** for type safety and clearer intent in the recommendation logic
- **Prisma + SQLite/Postgres** for modelling and querying the car data
- **Tailwind CSS** for quick, consistent styling
- **Vercel** for deployment and easy previews

I chose this stack because it is one of the fastest ways to ship a real full‑stack app with server routes, typed models, and a good developer experience. I had not built this exact architecture before, but the assessment allowed using AI tools, so I leaned on them to move quickly while still respecting the constraints and keeping the core logic understandable.

### Database & Deployment Notes

- The first version used SQLite locally. On Vercel’s serverless runtime, SQLite cannot reliably open a local `.db` file, which led to `Error code 14: Unable to open the database file`.
- The app now uses a hosted Postgres database (via Vercel Postgres) and Prisma.
---

## What was delegated to AI vs. done manually?

AI tools were involved in almost every part of the project.

**AI tools helped most with:**

- Exploring tech stack options and folder structure
- Drafting initial versions of components, the Prisma schema, and utility functions
- Iterating on copy (labels, explanations) and this README text
- Debugging smaller errors and wiring things together faster

**Done more manually / with more control:**

- Defining the **recommendation logic** (which signals matter, how to weight them, how to parse budgets and brand preferences)
- Deciding the **user flow** and what to show on the main screen and in the results
- Simplifying and cleaning up AI‑generated code so it stays within the assignment’s scope and is easy to reason about

---

## If I had another 4 hours

With another 4 hours, I would:

- Add an **optional LLM‑based intent parser** as a fallback to better understand nuanced, natural language queries.
- Experiment with simple **ML/AI scoring**, e.g. weighting based on feedback or simulated user data.
- Polish the **UI** further (more responsive layout, better empty states, smoother interactions, and basic result filters).

These additions would make the app feel smarter and more polished without changing the core structure.

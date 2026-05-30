**What did you build and why? What did you deliberately cut?**
I built NextDrive, a car recommendation app that suggests cars based on a user’s real preferences: budget, safety, mileage, performance, and their affinity for specific brands. The focus is on how people actually shop for cars in India—most buyers, including me, start from “I trust these brands” and “this is my budget and use case,” not from raw specs. The system takes that natural preference input and turns it into scores to rank cars.

Deliberately, I did not build:

Complex infrastructure (microservices, queues, etc.)

Authentication or user accounts

A flashy, animated UI

Any heavy ML/AI models or LLM integration in the core flow

The goal was to ship a clean, end‑to‑end recommendation flow that is easy to understand and review, rather than an over‑engineered system.

**What’s your tech stack and why did you pick it?**
Tech stack:

Next.js (App Router) + React for the frontend and backend in a single codebase

TypeScript for type safety and clearer intent

Prisma + SQLite/Postgres for modelling and querying the car data

Tailwind CSS for quick, consistent styling

Vercel for deployment

I chose this stack because it is one of the fastest ways to ship a real full‑stack app with server routes, typed models, and a good DX. I had not built this exact architecture before, but the assessment allowed using AI tools, so I leaned on them to move quickly while still respecting the constraints and keeping the core logic understandable.

**What did you delegate to AI tools vs. do manually? Where did the tools help most? Where did they get in the way?**
AI tools were involved in almost every part of the project:

Helped most with:

Exploring tech stack options and folder structure

Drafting initial versions of components, Prisma schema, and utility functions

Iterating on copy (labels, explanations) and README text

Debugging smaller errors and wiring things together faster

Done more manually / with more control:

Defining the recommendation logic (which signals matter, how to weight them, how to parse budgets and brand preferences)

Deciding the user flow and what to show on the main screen and results

Simplifying and cleaning up AI‑generated code so it stays within the assignment’s scope

**If you had another 4 hours, what would you add?**
With another 4 hours, I would:

Add an optional LLM‑based intent parser as a fallback to better understand nuanced, natural language queries.

Experiment with simple ML/AI scoring (e.g., weighting based on feedback or simulated user data).

Polish the UI further (more responsive layout, better empty states, smoother interactions, maybe basic filters on the results).

These would make the app feel smarter and more polished without changing the core structure.

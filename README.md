# Incident Tracker Mini App

A full-stack web application for engineers to create, browse, and manage production incidents.

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Backend Setup
1. `cd backend`
2. `npm install`
3. `npx prisma db push` (Initializes the SQLite database)
4. `npx ts-node prisma/seed.ts` (Seeds the database with ~200 records)
5. ` npx ts-node index.ts` (Starts server on port 3000. *Note: add `"dev": "nodemon index.ts"` to your package.json scripts*)
`NOTE : `Add a .env file in the backend folder with the following content: DATABASE_URL="file:./dev.db"

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts Vite dev server)

## API Overview
- `GET /api/incidents` - Fetches incidents. Accepts query params: `page`, `limit`, `search`, `status`, `service`, `severity`, `sortBy`, `sortOrder`.
- `GET /api/incidents/:id` - Fetches a single incident by ID.
- `POST /api/incidents` - Creates a new incident.
- `PATCH /api/incidents/:id` - Updates an existing incident (e.g., changing status).

## Design Decisions & Tradeoffs
1. **Database:** Chosen **SQLite + Prisma**. Tradeoff: SQLite is not meant for massive scale or concurrent writes, but it is perfect for a mini-app as it requires zero environment configuration for the reviewer, ensuring the app runs flawlessly on the first try. Prisma provides excellent Type safety.
2. **Pagination:** Implemented **Server-side pagination**. Tradeoff: Requires a database hit on every page turn, but guarantees memory efficiency and scalability on the frontend, which is critical for an incident log that could grow infinitely.
3. **Search:** Implemented **Debounced frontend search**. Tradeoff: Adds a slight delay (500ms) to user input, but drastically reduces API spam and database load.
4. **State Management:** Used native React `useState`/`useEffect`. Tradeoff: Slightly more boilerplate than a tool like React Query, but keeps the dependency tree exceptionally light.

## Improvements with more time
1. **Validation:** Implement `Zod` on both the frontend forms and backend routes to ensure strict runtime type safety and better error messages.
2. **Data Fetching:** Swap standard `fetch` with `@tanstack/react-query` to handle request caching, automatic retries, and more robust loading/error states.
3. **Database:** Migrate to PostgreSQL for true production readiness.
4. **UI:** Add toaster notifications for success/error states when creating or updating incidents.
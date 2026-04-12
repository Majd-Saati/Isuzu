# Application overview

## What this application does

The app is an internal **marketing operations dashboard** (Isuzu / dealer context). It lets authenticated users:

- See a **dashboard** with dealer summaries, multiple chart types, a reporting table, and recent activity.
- Manage **marketing plans** and nested **activities** (status, budgets, media, comments, and more).
- View and adjust **budget allocations** per term (and per company when admin).
- Browse **charts** (similar visualizations to the dashboard, plus placeholder “efficiency” demo state).
- Open a **calendar** view of plans and costs for a selected term (and company when admin).
- Maintain **terms** (time periods) and **term exchange rates**.
- When **admin**: manage **companies** (dealers), **users**, **countries**, and **administrator** accounts.

All business data comes from a **backend REST API**; this repository is the **frontend only**.

## Technology stack

| Area | Choice |
|------|--------|
| UI | React 18 |
| Build | Vite 5 |
| Routing | React Router 6 |
| Global auth user | Redux Toolkit (`auth` slice) |
| Server state / caching | TanStack React Query 5 |
| HTTP | Axios (shared `apiClient`) |
| Styling | Tailwind CSS, Radix UI primitives, custom components |
| Charts | Recharts |
| Forms / validation | React Hook Form, Formik, Yup, Zod (used in different areas) |
| Notifications | Sonner toasts |
| Other | `date-fns`, `xlsx`, `jspdf` / `html2canvas` (export paths where implemented) |

## Entry points and bootstrap

- **`src/main.jsx`** — mounts the React tree (not expanded here; standard Vite + React).
- **`src/App.jsx`** wraps the app with:
  - Redux `Provider` (`store` from `src/store/store.js`)
  - React Query `QueryClientProvider`
  - `ThemeProvider` (`src/contexts/ThemeContext.jsx`)
  - `CurrencyProvider` (`src/contexts/CurrencyContext.jsx`)
  - `CurrencyBootstrap` — resolves default currency for non-admins when needed
  - `TooltipProvider` — shared tooltip behavior
  - `ListDataPrefetcher` — prefetches terms (and countries for non-admins) when logged in
  - `DealersPrefetcher` — prefetches dealer/company list for **admins** when logged in
  - `Toaster` (Sonner) — global toast styling and duration
  - `BrowserRouter` + `AppRouter`

## Project structure (high level)

```
src/
  App.jsx                 # Root providers and router mount
  components/             # UI by feature (dashboard, marketing, budgets, calendar, …)
  contexts/               # Theme, currency
  data/                   # Static navigation config
  hooks/                  # Feature hooks; hooks/api/* wrap services with React Query
  lib/                    # permissions, api client, helpers
  pages/                  # Route-level screens
  router/                 # AppRouter, routes, lazy-loaded pages
  store/                  # Redux store and auth slice
  validations/            # e.g. login validation
```

**Note on naming:** The route `/companies` lazy-loads `src/pages/Users.jsx`, which exports the **Companies** page component (historical filename). The route `/users` loads `UsersPage.jsx`.

## Environment configuration

- **`VITE_API_BASE_URL`** — optional override for the API base URL.
- If unset, the client falls back to `https://marketing.5v.ae/api/` (see `src/lib/api/client.js`).

Example `.env`:

```env
VITE_API_BASE_URL=https://your-api.example.com/api/
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |

## Lazy loading

Page components are loaded with `React.lazy()` from `src/router/lazyComponents.js` to reduce initial bundle size. `Suspense` is used in `AppRouter` with a `fallback` of `null` (no global loading UI at the router level).

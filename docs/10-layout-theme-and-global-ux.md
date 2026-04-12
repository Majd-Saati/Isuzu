# Layout, theme, and global UX

## App shell (`Layout`)

**File:** `src/components/Layout.jsx` (loaded lazily as `Layout` in `lazyComponents.js`).

Responsibilities (`src/components/Layout.jsx`):

- Renders **`Sidebar`** and main content **`Outlet`** for nested routes.
- Wraps **`Outlet`** in **`Suspense`** with `fallback={null}` (nested alongside router-level suspense).
- Manages **mobile sidebar open/close** and **desktop collapse** state passed to `Sidebar`.
- Includes **`Header`** with branding, notifications (if any), **currency** controls for eligible users, **theme** toggle, and **user menu** (profile, logout).

## Sidebar (`Sidebar.jsx`)

- **Logo** — links to dashboard; collapsed mode shows “I” mark.
- **Collapse toggle** — desktop only; animates width between full and narrow rail.
- **Main / Other navigation** — from `navigationData.js`, filtered by `canAccessRoute`.
- **Companies** (admin) — expandable list from **`useDealers`**; color dot per company; navigates to Marketing Plans or Budgets Allocation with query params.
- **Add company** — opens `AddEditCompanyModal`.
- **Mobile** — overlay backdrop closes drawer on outside click.

## Theme (`ThemeContext`)

- Integrates with **`next-themes`** pattern (see `src/contexts/ThemeContext.jsx`) for light/dark (or system) preference.
- Tailwind **`dark:`** variants are used extensively across pages.

## Currency (`CurrencyContext` + `CurrencyBootstrap`)

- **Storage key:** `app_currency` in `localStorage`.
- **Non-admin:** persisted currency drives display and the **`x-currency`** HTTP header (see API client).
- **Admin:** typically does **not** send `x-currency`; UI may show JPY or admin-specific formatting via helpers like `getEffectiveCurrencyCode`.
- **`CurrencyBootstrap`** runs after login to set an initial currency when none is stored (often from countries API).

## Toasts (Sonner)

Configured in `App.jsx`: top-right, rich colors, close button, 4s duration, custom class names for light/dark.

## Tooltips

`TooltipProvider` wraps the app so Radix/shadcn-style tooltips work in nested components.

## Not found (`*`)

**Page:** `src/pages/NotFound.tsx`  
**Route:** catch-all in `AppRouter` for unknown paths.

## Logout modal

**`LogoutModal`** — confirms logout before clearing session (triggered from user menu where wired).

## Code splitting

Route components are **`lazy()`** loaded; expect a brief blank `Suspense` fallback until chunks load (`fallback={null}` in router).

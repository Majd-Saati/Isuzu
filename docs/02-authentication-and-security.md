# Authentication and security

## Login flow

- **Route:** `/login` and `/` both render the `Login` page (`src/pages/Login.jsx`).
- The page shows `LoginHero` and `LoginCard` (credentials and submission UI in `src/components/login/`).
- On success, the backend response is expected to align with how `authService` and dispatch logic store:
  - **`authToken`** in `localStorage`
  - **`user`** (JSON object) in `localStorage`
- Redux **`setUser`** updates `state.auth.user` and `state.auth.isAuthenticated` (see `src/store/slices/authSlice.js`).

## Session persistence

- On app load, `authSlice` reads `user` from `localStorage` into Redux so the UI knows who is logged in.
- **`authService.isAuthenticated()`** returns true if `authToken` exists (`src/lib/api/services/authService.js`).
- **`WithGuard`** wraps all layout routes: if not authenticated, the user is redirected to `/login` with `state.from` preserved for potential return navigation (`src/components/WithGuard.jsx`).

## Logout

- `authService.logout()` removes `authToken` and `user` from `localStorage`.
- Redux `logout` clears user state.
- The header / user menu triggers logout (see `UserMenuDropdown` and related components).

## HTTP 401 handling

`src/lib/api/client.js` response interceptor:

- On **401**, clears token and user from `localStorage`, shows a “session expired” toast, and sets `window.location.href = '/login'`.

## Admin vs non-admin

The app treats a user as **admin** when any of these is true on the `user` object:

- `is_admin === '1'` (string)
- `is_admin === 1` (number)
- `is_admin === true` (boolean)

This check is repeated in guards, permissions, and the API client where relevant.

## Route guards

| Guard | Role |
|--------|------|
| **`WithGuard`** | Must be logged in (valid token). Wraps `Layout` and all in-app pages. |
| **`PermissionGuard`** | Uses `canAccessRoute(user, pathname)`. If denied, redirects to `/dashboard`. Applied to: Dashboard, Marketing Plans, Budgets Allocation, Charts, Calendar, Terms. |
| **`AdminGuard`** | Requires admin. If not admin, redirects to `/dashboard`. Applied to: Administrators, Companies, Users, Countries. |

## Permission model (`src/lib/permissions.js`)

### Normal users

Non-admin access is **not** a free-form permission matrix from the server in this file. Instead, a fixed allow-list **`NORMAL_USER_PERMISSIONS`** defines which **named capabilities** are considered allowed (e.g. `plans_list`, `overview`, `calendar_view`, `terms_list`, activity/plan mutations, etc.).

### Routes vs permissions

`ROUTE_PERMISSIONS` maps paths to a **single required permission** (or `null` for admin-only routes):

| Path | Required permission (non-admin) |
|------|--------------------------------|
| `/dashboard` | `overview` |
| `/marketing-plans` | `plans_list` |
| `/budgets-allocation` | `plans_list` |
| `/terms` | `terms_list` |
| `/calendar` | `calendar_view` |
| `/charts` | `overview` |
| `/companies`, `/users`, `/countries`, `/administrators` | `null` (admin only) |

Admins bypass permission checks and can access every route that `AdminGuard` / `PermissionGuard` combination allows.

### Sidebar visibility

`Sidebar` filters `mainNavigation` and `otherNavigation` with `canAccessRoute` so users only see menu entries for pages they may open (`src/components/dashboard/Sidebar.jsx`).

## API client: currency and scoping (`src/lib/api/client.js`)

- **Bearer token** is sent as `Authorization: Bearer <authToken>` when present.
- **Non-admin requests** attach header **`x-currency`** from stored app currency (`getStoredCurrency()`), unless the user is admin.
- **Non-admin GET requests:** `company_id` is **stripped from query params** so the backend can scope data by the authenticated user. Admins may pass `company_id` to filter.

## API response shape

The axios response interceptor expects JSON with a `status` field:

- If `status === false`, the message is shown via toast and the promise is rejected.
- Success responses may include `message`; for non-GET methods, a success toast is shown when `message` is present.

## Terms page vs permission list

The Terms UI uses `hasPermission(user, 'term_create' | 'term_update' | 'delete_term')` for buttons. Those keys are **not** in `NORMAL_USER_PERMISSIONS` in `permissions.js`, so **only admins** typically see create/edit/delete for terms unless the permission model is extended. Listing terms still uses `terms_list` for route access.

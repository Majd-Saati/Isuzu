# Marketing Plans (`/marketing-plans`)

**Page:** `src/pages/MarketingPlans.jsx`  
**Access:** `PermissionGuard` — non-admins need `plans_list`.

## Purpose

Central workspace for **marketing plans** (per company and term) and their **activities**. Users can search, filter by company and term (admins), create/edit plans, and drill into activities in a rich table/drawer experience.

## Page layout

1. **Title** — “Marketing Plans” with brand underline styling.  
2. **`MarketingPlansActionBar`** — add plan (when permitted), company/term filters for admins, search field.  
3. **`MarketingPlansTable`** (or skeleton / empty state).

## Data loading

### Plans

- **`usePlans`** with:
  - `page`, `perPage`
  - `companyId` — from URL/filter (admin); omitted for non-admin (API scopes by user)
  - `termId`
  - `search` — optional text search

### Activities for visible plans

- **`useActivities`** with `planIds` from the current page of plans, `page: 1`, `perPage: 100` so the table can show activity rows or summaries without N+1 requests per plan.

Loading state waits for **both** plans and activities queries.

## Filters and URL sync (`useMarketingPlansFilters`)

Defined in `src/hooks/useMarketingPlansFilters.js`.

- Reads **`company_id`**, **`term_id`**, **`page`**, **`per_page`** from the query string and keeps React state in sync when the location changes.
- **Companies list** for filters is fetched only when the user is **authenticated and admin** (`useCompanies`).
- **Terms** list is fetched for all authenticated users (`useTerms`).
- Provides `companyFilter`, `termFilter`, IDs, names, and `isAdmin` to the page and action bar.

This allows **bookmarkable** URLs and deep links from the sidebar **Companies** shortcuts.

## Sidebar shortcut: company → Marketing Plans

For admins, the sidebar lists companies from **`useDealers`**. Clicking a company navigates to:

`/marketing-plans?company_id=<id>&page=1&per_page=20`

The same pattern applies when already on **Budgets Allocation** (see budgets doc): the sidebar keeps you on that route but sets `company_id`.

## Add / Edit plan modal (`AddPlanModal`)

- Opened from the action bar (“Add plan”) or from row **Edit** (`onEditPlan`).
- **`mode`:** `create` or `edit`; **`initialPlan`** when editing.
- **`preselectedCompanyId` / `preselectedCompanyName`** — when the page filter is set, new plans default to that company.
- Submit calls **`useCreatePlan`** or **`useUpdatePlan`**; on success the modal closes and React Query invalidates refresh lists (per hook implementation).

## Marketing plans table

**Component:** `MarketingPlansTable` (`src/components/marketing/MarketingPlansTable.jsx` and related).

Typical capabilities (exact columns depend on implementation):

- **`showBudgetColumns`** and **`showMediaUploadColumns`** are enabled on this page.
- **Edit plan** callback wired to open the modal with plan data.
- **Activities** — nested rows or expandable sections using `activities` and `plansSummary` from the activities query.
- **Dealer plan table** subcomponents may include status dropdowns, activity drawers, file uploads, etc. (`DealerPlanTable`, `ActivityDrawer`, `AddActivityModal`).

## URL deep link: open activity drawer

Query parameters:

- **`activity_id`** or **`activity`** — activity id to open.
- **`openDrawer`** — when truthy (`1`, `true`, `yes`), the table receives **`autoOpenActivityId`** so the UI can open the activity drawer for that id.

If `openDrawer` is absent, it defaults to treating the drawer flag as enabled when resolving `activityIdFromUrl` (see `MarketingPlans.jsx` — the code uses `(openDrawerParam || '1')`).

## Permissions

- Route access: **`plans_list`** for non-admins.
- Creating/updating/deleting plans and activities is enforced by the **API**; the UI may hide or disable actions based on user role or future permission checks in components.

## Console logging

The page currently includes a `console.log('isAdmin', isAdmin)` call — safe to remove in production cleanup; it does not affect behavior.

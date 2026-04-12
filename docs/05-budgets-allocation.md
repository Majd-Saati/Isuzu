# Budgets Allocation (`/budgets-allocation`)

**Page:** `src/pages/BudgetsAllocation.jsx`  
**Access:** `PermissionGuard` — non-admins need `plans_list` (same as Marketing Plans).

## Purpose

View and manage **budget allocations** grouped by **term**, with optional **company** scope for administrators. Dealers (non-admin users) typically see allocations for their own organization only, consistent with API scoping.

## Page copy

- **Admin:** “View and manage budget allocations by term and company.”
- **Non-admin:** “View budget allocations by term.”

## Main UI: `BudgetAllocationTable`

**Entry:** `src/components/budgets/BudgetAllocationTable/index.jsx`  
**Logic hook:** `useBudgetAllocationTable` (`hooks/useBudgetAllocationTable.js`).

### Data

- **`useBudgetAllocationList`** — loads paginated allocation data (`page`, `per_page`; optional `company_id` for admins).
- **`useTerms`** — supplementary term list for filters/UI where needed.
- **`useCompanies`** — **only when admin**; powers a company filter dropdown.

### Admin company filter

- Admins can set **`companyId`** to filter allocations for one dealer/company.
- Non-admins do not send `company_id` in the list params; the API client also strips `company_id` from GET params for non-admins globally.

### Term ordering

Terms returned in the allocation payload are sorted **newest first** using `start_date`, then `end_date` as fallback (`termDateDescKey`).

### States

The table components handle:

- Loading skeleton (`BudgetAllocationTableSkeleton`)
- Error state (`ErrorState`)
- Empty state when no terms or no allocations (`EmptyState`, `hasAnyAllocations`)

### Row-level actions

**`AllocationRow`** and **`SetBudgetAllocationModal`** (under `components/budgets/SetBudgetAllocationModal/`) allow setting or editing allocation amounts per term/category as implemented in the modal and service layer (`budgetAllocationService`, `useBudgetAllocation` hooks).

Exact field names and validation live next to those components; they post/put to the API via the shared `apiClient`.

## Sidebar integration

When an admin clicks a company in the sidebar while on **Budgets Allocation**, navigation stays on `/budgets-allocation` and sets:

`?company_id=<id>&page=1&per_page=20`

This matches Marketing Plans deep-linking behavior but keeps the user on the budgets page.

## Relationship to Marketing Plans

Budget allocations define how much budget is assigned per term (and company). **Marketing plans** and **activities** consume that budget in planning and execution; charts such as “Support vs Allocation” compare **support spend** to **allocated** amounts from chart/overview endpoints.

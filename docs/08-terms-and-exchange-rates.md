# Terms (`/terms`) and term exchange rates

**Page:** `src/pages/Terms.jsx`  
**Access:** `PermissionGuard` — non-admins need `terms_list`.

## Purpose

1. **Terms** — business time periods (e.g. fiscal or campaign windows) used across plans, budgets, and charts.  
2. **Term exchange rates** — currency conversion rates associated with a term for financial consistency.

## Terms table section

### Data

- **`useTerms({ page, perPage, search })`** — paginated, searchable list.
- **`useDeleteTerm`** — delete mutation with confirmation.

### UI

- **`TermsPageHeader`**, **`TermsActionBar`** — search and optional “Add term”.
- **`TermsTable`** with pagination callbacks.
- **`TermsTableSkeleton` / `TermsTableEmpty`** — loading and empty states; empty may show “Add” if allowed.

### Permissions (UI level)

- **`hasPermission(user, 'term_create')`** — show create / empty-state add.
- **`hasPermission(user, 'term_update')`** — pass `onEdit` to table.
- **`hasPermission(user, 'delete_term')`** — pass `onDelete` to table.

As documented in [02-authentication-and-security.md](./02-authentication-and-security.md), these keys are **not** in `NORMAL_USER_PERMISSIONS`; **admins** always pass `hasPermission`. Non-admins usually get **view-only** term management UI unless the permissions module is updated.

### Modals

- **`AddEditTermModal`** — create/edit term (`editData` when editing).
- **`DeleteConfirmationModal`** — warns that deleting a term removes associated plans and budget data (wording on the modal).

## Term exchange rates section

### Secondary term list

- **`useTerms({ page: 1, perPage: 100 })`** — powers the **Term:** dropdown for exchange rates independently of the main table pagination.

### Default term selection

- **`getLatestTermId`** picks the term with the latest `start_date` (fallback `end_date`, then first item).
- **`useLayoutEffect`** keeps `exchangeTermId` valid when the term list changes; resets pagination when the filter changes.

### Data

- **`useTermExchange({ page, perPage, termId }, { enabled })`** when `exchangeTermId` is set and terms exist.
- Returns **`exchanges`**, **`pagination`**, and **`term`** metadata.

### UI

- Section title: **“Term exchange rates”**.
- **Filter bar:** dropdown + **“Add exchange rate”** button.
- **`TermExchangeTable`** with pagination, edit callback.
- **`AddTermExchangeModal`** — `defaultTermId` syncs with current filter.
- **`EditTermExchangeModal`** — `editData` from row edit.

### Empty / error states

- No terms: message to add a term first.
- Loading: `TermExchangeTableSkeleton`.
- Error: red bordered panel.
- No exchanges: `TermExchangeTableEmpty`.

## How terms are used elsewhere

- **Marketing Plans** and **Budgets** attach plans and allocations to a **term**.
- **Dashboard / Charts** filter chart APIs by **`term_id`** or by **month** (which maps to term windows on the backend).
- **Calendar** requires a **term** to load the grid.

# Calendar (`/calendar`)

**Page:** `src/pages/Calendar.jsx`  
**Access:** `PermissionGuard` — non-admins need `calendar_view`.

## Purpose

**Marketing calendar view** for a selected **term** and, for admins, a **company** (or “all”). It shows summary costs, term/company cards, and a **month × plan** style table of activities and spend.

## State and data: `useCalendarPage`

**Hook:** `src/hooks/calendar/useCalendarPage.js`.

| Concern | Behavior |
|---------|----------|
| **Admin detection** | `is_admin === '1'` or `1` |
| **Terms** | Loaded with `useTerms({ page: 1, perPage: 100 })` |
| **Companies** | `useCompanies` only if admin |
| **Non-admin company** | `useEffect` sets `selectedCompanyId` from `currentUser.company_id` when present |
| **Query params** | `{ term_id, company_id? }` — `company_id` omitted when `selectedCompanyId === 'all'` |
| **`isQueryEnabled`** | Requires `selectedTermId`. For admins, also requires `selectedCompanyId === 'all'` or a concrete company id. Non-admins: enabled once term is chosen (company auto-set). |
| **API** | `useCalendarView(calendarParams, { enabled })` |
| **Summary** | `computeSummaryStats(calendarData)` in `calendarUtils.js` |

## UI flow

1. **`SectionTitle`** — “MARKETING CALENDAR VIEW”.
2. **`CalendarFilters`** — term select; company select or “all” for admins.
3. Until the query is enabled: **`CalendarEmptyState`** explains what to select (different hint for admin).
4. **Loading:** `CalendarLoadingState`.
5. **Error:** `CalendarErrorState` with optional `error.message`.
6. **Success:**
   - **`SummaryCards`** — `totalActualCost`, `totalSupportCost`, admin flag, currency.
   - **Grid:** `CalendarTermCard` always; `CalendarCompanyCard` when a specific company is selected (not `all`).
   - **`CalendarTable`** — `plans`, `months`, admin flag, currency.

## Currency

Uses **`useCurrency`** and **`getEffectiveCurrencyCode(isAdmin, currency)`** so display matches the same admin vs dealer rules as the dashboard.

## Related backend

Implemented in `calendarService` + `useCalendar` hooks under `src/lib/api/services/` and `src/hooks/api/`.

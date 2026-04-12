# Charts (`/charts`) and reporting

**Charts page:** `src/pages/Charts.jsx`  
**Access:** `PermissionGuard` — non-admins need `overview`.

## Purpose

The **Charts** page is a dedicated analytics view. It repeats several dashboard-style sections (dealer efficiency, support vs allocation, marketing charts, yearly expense, two-year compare) and adds:

- **`SectionNav`** with an extra item **Efficiency Charts** (demo / placeholder behavior).
- A **Reporting Table** section at the bottom.

## Shared sections (same ideas as dashboard)

| Section | Components |
|---------|------------|
| Dealer Efficiency | `DealerEfficiencyChartByMonth`, `DealerEfficiencyChartByTerm` (local duplicates in `Charts.jsx`) |
| Support vs Allocation | `SupportAllocationChartByMonth`, `SupportAllocationChartByTerm` |
| Marketing Charts | `MarketingChartsSection` |
| Yearly Expense | `YearlyExpenseChart` |
| Two Years Compare | `TwoYearsCompareChart` |

Filters and admin vs non-admin behavior mirror the dashboard: admins pick **company**; everyone picks **month** or **term** as required. Data comes from **`useCharts`** and related hooks.

## Efficiency Charts (placeholder / demo)

The section **`id="efficiency-charts"`** uses local React state:

- `efficiencyChartsState`, `performanceChartState`, `reportingState` — each cycles `loading` → `data` after a `setTimeout` (1.5s) on mount.

**Dealer efficiency slot:** In the `'data'` case the JSX renders **commented-out** `DealerEfficiencyChart` lines; the visible result can be empty or fall through depending on state. There are also hard-coded **`expenseData`** and **`budgetData`** objects for static demos.

**Performance chart:** `PerformanceChart` / skeleton / empty components exist; the bar chart block is **commented out** in the JSX.

**Reporting:** Still renders **`ReportingTable`** in the reporting section (see below).

> **Note for maintainers:** This section is partly scaffolding for design/testing. For production clarity, consider wiring it fully to `useCharts` or removing unused demo state.

## Reporting table (Dashboard + Charts)

**Component:** `ReportingTable` (`src/components/dashboard/ReportingTable/`).  
**Hook:** `useReportingTable`.

### Behavior

- Loads **terms** via `useTerms` (up to 100) and defaults **`selectedTermId`** to the first term.
- Fetches **report** data with **`useReport({ term_id })`** when a term is selected.
- **`hasData`** is true when `reportData.months` is a non-empty array.
- **Evidence modal:** Rows can open an evidence viewer with `handleOpenEvidences(evidences, activityName, activityId)` showing uploaded proof files for an activity.

### Filters

- **`TermFilter`** in the reporting table header lets users switch the active term for the report grid.

### Export utilities

`src/components/charts/chartExportUtils.js` (and related) support exporting chart visuals; reporting rows may link to evidence or exports depending on column implementation—inspect `ReportingTable` components for the exact buttons.

## Chart export (general)

`chartExportUtils.js` coordinates **html2canvas** / **jspdf** or similar for downloading chart images where wired from chart components.

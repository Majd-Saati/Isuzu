# Dashboard (`/dashboard`)

**Page:** `src/pages/Index.jsx`  
**Access:** `PermissionGuard` â€” requires `overview` for non-admins (`src/lib/permissions.js`).

## Purpose

The dashboard is the main landing area after login. It aggregates **dealer/company summaries**, **efficiency and budget visualizations**, **marketing charts**, **yearly and multi-year comparisons**, a **reporting table**, **recent overview** content, and a grid of **ISUZU dealer cards**.

## Section navigation (`SectionNav`)

A sticky-style **anchor navigation** lists sections so users can jump within the long page:

1. Dealer Efficiency  
2. Support vs Allocation  
3. Marketing Charts  
4. Yearly Expense  
5. Two Years Compare  
6. Reporting Table  
7. Overview Recently  
8. ISUZU Dealers  

Each section uses an `id` matching these anchors (e.g. `id="dealer-efficiency"`).

## Dealer Efficiency (by month / by term)

Two side-by-side widgets (`DealerEfficiencyChartByMonth`, `DealerEfficiencyChartByTerm`):

- **Data source:** `useCharts` hook (charts API) with either `month` or `term_id`, plus `company_id` for admins.
- **Admin:** Company dropdown + month picker or term dropdown.  
- **Non-admin:** Company is fixed to the logged-in userâ€™s id; only month/term selection applies.
- **Chart meaning:** Builds `DealerEfficiencyChart` data from API `totals`: compares **support cost** to **actual cost** (expense), expressed as a capped percentage for the radial/visual display.
- **Empty states:** Prompts to select month/term; shows â€œNo data availableâ€ on error or missing totals.

## Support amount vs budget allocation

Two parallel widgets (`SupportAllocationChartByMonth`, `SupportAllocationChartByTerm`):

- Same filter pattern as dealer efficiency (month or term, company for admin).
- Uses **`month_term_budget_allocation`** or **`term_budget_vs_support`** from the charts API together with `totals.support_cost`.
- Labels in the chart: **Allocated Budget** vs **Support Amount** (via `amountLabel` / `legendLabel` on `DealerEfficiencyChart`).

## Marketing charts section

- **`MarketingChartsSection`** (`src/components/charts/`) â€” additional chart blocks driven by the marketing/charts hooks and filters (month or term, consistent with the charts feature set).

## Yearly expense

- **`YearlyExpenseChart`** â€” expense by selected year.

## Two years compare

- **`TwoYearsCompareChart`** â€” compares support cost (JPY) across two years with filters defined in that component.

## Reporting table

- **`ReportingTable`** â€” term-based report with evidence modal (see [06-charts-and-reporting.md](./06-charts-and-reporting.md)).

## Overview Recently

- **`SectionTitle`** + **`OverviewRecentlySection`** â€” recent activity or summary widgets (implementation in `src/components/dashboard/OverviewRecentlySection.jsx` and related files).

## ISUZU Dealers (dealer cards)

- **`useOverview()`** loads `dealersSummary` from the overview API.
- **Loading:** skeleton grid (`DealerCardSkeleton`).
- **Error:** bordered error panel.
- **Empty:** `DealerCardsEmpty`.
- **Data mapping:** Each dealer gets:
  - Name, logo URL (relative paths prefixed with `https://marketing.isuzu-tech.com/`)
  - Term list sorted by `start_date` descending, showing plan counts per term
  - Costs: `support_cost_total`, `actual_cost_total`, `estimated_cost_total`, `total_cost`
- **Display:** `DealerCard` with `isAdmin` and **currency** from `CurrencyContext` (`useCurrency`).

## Currency display

Non-admin users see amounts in the **selected app currency** (header/currency bootstrap). Admins typically see **JPY** semantics as documented in `CurrencyContext` and `getEffectiveCurrencyCode` helpers where used.

## Dashboard vs Charts page

The **Dashboard** and **Charts** pages share many of the same chart components and APIs. The Charts page adds a dedicated **Efficiency Charts** subsection with **local state** (`efficiencyChartsState`, etc.) that can show skeletons, empty placeholders, or static demo data for two legacy-style charts (see Charts documentation).

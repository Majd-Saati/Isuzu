# Isuzu Marketing Platform — Documentation

This folder contains detailed documentation for the web application in this repository. The app is a **React (Vite) dashboard** for marketing plans, budgets, terms, calendar views, charts, and administration, backed by a REST API.

## How to read these docs

| Document | Contents |
|----------|----------|
| [01-application-overview.md](./01-application-overview.md) | Purpose, tech stack, project layout, environment, build commands |
| [02-authentication-and-security.md](./02-authentication-and-security.md) | Login, session storage, route guards, permissions, API client behavior |
| [03-dashboard.md](./03-dashboard.md) | Home dashboard: dealer cards, charts, reporting, navigation anchors |
| [04-marketing-plans.md](./04-marketing-plans.md) | Plans list, filters, activities, drawers, URL deep links |
| [05-budgets-allocation.md](./05-budgets-allocation.md) | Budget allocation by term and company |
| [06-charts-and-reporting.md](./06-charts-and-reporting.md) | Dedicated Charts page, efficiency widgets, marketing charts, reporting table |
| [07-calendar.md](./07-calendar.md) | Marketing calendar view, filters, summary, grid |
| [08-terms-and-exchange-rates.md](./08-terms-and-exchange-rates.md) | Terms CRUD, term exchange rates |
| [09-administration.md](./09-administration.md) | Companies, Users, Countries, Administrators |
| [10-layout-theme-and-global-ux.md](./10-layout-theme-and-global-ux.md) | Layout, sidebar, theme, currency, toasts, 404 |

For **API layer patterns** (services, React Query hooks, adding endpoints), see also [`../src/lib/api/README.md`](../src/lib/api/README.md).

# Administration: Companies, Users, Countries, Administrators

All routes below use **`AdminGuard`**: only users with `is_admin` true/`1` may access them. Non-admins are redirected to `/dashboard`.

---

## Companies (`/companies`)

**Implementation note:** Route lazy-loads **`src/pages/Users.jsx`**, which exports the **`Companies`** React component (file name is historical).

### Purpose

CRUD for **dealer companies**: list, search, add, edit, delete.

### UI

- **`CompaniesPageHeader`**, **`CompaniesActionBar`**
- **`CompaniesTable`** with pagination
- **`AddEditCompanyModal`**
- **`DeleteConfirmationModal`**

### Data

- **`useCompanies({ page, perPage, search })`**
- **`useDeleteCompany()`**

### Sidebar: add company

Admins can open **`AddEditCompanyModal`** from the **+** control next to “Companies” in the sidebar (`Sidebar.jsx`).

---

## Users (`/users`)

**Page:** `src/pages/UsersPage.jsx`

### Purpose

Manage **non-admin and admin user accounts** tied to companies: list, filter, create, edit, delete.

### Filters (action bar)

- Search text
- **Company** dropdown — options from **`useDealers()`** (same dealer list as sidebar companies)
- **Status** filter
- **Role / isAdmin** filter — passed to API as `isAdmin` query param when set

### Data

- **`useUsers({ page, perPage, search, companyId, status, isAdmin })`**
- **`useDeleteUser()`**

### Safety

- Delete flow typically prevents deleting your own account (see modal handlers mirroring **Administrators** page).

### Modals

- **`AddEditUserModal`** for create/edit
- **`DeleteConfirmationModal`**

---

## Countries (`/countries`)

**Page:** `src/pages/Countries.jsx`

### Purpose

Maintain the **country** reference list (used for currency/region configuration and linked entities depending on API design).

### UI

- Search, add, table, edit/delete modals
- **`CountriesTable`**, **`AddEditCountryModal`**, **`DeleteConfirmationModal`**

### Data

- **`useCountries({ page, perPage, search })`**
- **`useDeleteCountry()`**

### Relation to currency

**`CurrencyBootstrap`** and **`CurrencyContext`** use country/currency data so non-admin users get a valid default **`x-currency`** header (see `CurrencyBootstrap` component).

---

## Administrators (`/administrators`)

**Page:** `src/pages/Administrators.jsx`

### Purpose

Manage users who are **administrators** only (`isAdmin: '1'` filter on the users API).

### Data

- **`useUsers({ page, perPage, isAdmin: '1', search })`**
- **`useCreateUser`**, **`useUpdateUser`**, **`useDeleteUser`**

### Behavior

- **`AddEditUserModal`** in admin mode for create/edit
- **Delete:** blocks deleting **your own** account (`currentUser.id` vs selected admin)
- Search, pagination, skeleton/empty states consistent with other admin tables

---

## Navigation entries

**`src/data/navigationData.js`** defines:

- **Main menu:** Dashboard, Marketing Plans, Budgets Allocation, Charts  
- **Others:** Terms, Calendar, Countries, Companies, Users, Administrators  

The **sidebar** filters these with **`canAccessRoute`**, so non-admins do not see admin-only links even if URLs were guessed.

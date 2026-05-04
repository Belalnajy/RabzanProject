# Rabzan Trading Company — Frontend Analysis for Backend Integration

> **Stack:** React 19, Next.js 16 (App Router), Tailwind CSS, Framer Motion, i18next (ar/en), Lucide Icons

---

## 1. Page Map & Routing Structure

### Auth Pages (`/src/app/(auth)/`)
| Route | File | Purpose |
|---|---|---|
| `/login` | `login/page.jsx` | Email/password login with "remember me" |
| `/register` | `register/page.jsx` | Full name, email, password, confirm password |
| `/forgot-password` | `forgot-password/page.jsx` | Email input → sends reset link |
| `/reset-password` | `reset-password/page.jsx` | New password + confirm (needs token from URL) |

### Dashboard Pages (`/src/app/(dashboard)/dashboard/`)
| Route | File | Purpose |
|---|---|---|
| `/dashboard` | `page.jsx` | KPI stats, order pipeline, recent orders |
| `/dashboard/categories` | `categories/page.jsx` | CRUD categories with inline form + list |
| `/dashboard/products` | `products/page.jsx` | Products table with filters, empty state |
| `/dashboard/products/new` | `products/new/page.jsx` | Create product form |
| `/dashboard/products/[id]` | `products/[id]/page.jsx` | Product detail view |
| `/dashboard/customers` | `customers/page.jsx` | Customers table with filters, empty state |
| `/dashboard/customers/new` | `customers/new/page.jsx` | Create customer form |
| `/dashboard/customers/[id]` | `customers/[id]/page.jsx` | Customer detail (financial, orders, activity) |
| `/dashboard/finance` | `finance/page.jsx` | Financial overview: stats, charts, tables |
| `/dashboard/commissions` | `commissions/page.jsx` | Commission tracking table + detail modal |
| `/dashboard/transactions` | `transactions/page.jsx` | Financial transactions + activity log tabs |
| `/dashboard/users` | `users/page.jsx` | User management table |
| `/dashboard/users/new` | `users/new/page.jsx` | Create user form |
| `/dashboard/roles` | `roles/page.jsx` | Roles grid + permissions overview |
| `/dashboard/reports` | `reports/page.jsx` | Multi-tab reports (overview/sales/financial/commissions) |
| `/dashboard/notifications` | `notifications/page.jsx` | Notification list with pagination |
| `/dashboard/settings` | `settings/page.jsx` | Multi-tab settings (general/workflow/financial/currency/preferences) |
| `/dashboard/profile` | `profile/page.jsx` | Profile info + password change |

### Orders (Top-level dashboard route)
| Route | File | Purpose |
|---|---|---|
| `/orders` | `orders/page.jsx` | Orders list with filters & pagination |
| `/orders/new` | `orders/new/page.jsx` | Multi-section order creation form |
| `/orders/[id]` | `orders/[id]/page.jsx` | Order detail: financials, payments, stages, attachments |

---

## 2. Required API Endpoints

### 2.1 Authentication
| Method | Endpoint | Request Body | Response | Notes |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | `{email, password, rememberMe}` | `{token, user}` | JWT/session |
| `POST` | `/api/auth/register` | `{fullName, email, password, confirmPassword}` | `{token, user}` | Validation: passwords match |
| `POST` | `/api/auth/forgot-password` | `{email}` | `{message}` | Sends email with reset link |
| `POST` | `/api/auth/reset-password` | `{token, newPassword, confirmNewPassword}` | `{message}` | Token from URL query param |

### 2.2 Dashboard Home
| Method | Endpoint | Response |
|---|---|---|
| `GET` | `/api/dashboard/stats` | `{activeOrders, monthlyRevenue, pendingCommissions, delayedShipments}` with trend data |
| `GET` | `/api/dashboard/pipeline` | Array of stage counts: `[{stage, count, percentage}]` |
| `GET` | `/api/dashboard/recent-orders` | `[{id, description, client, time, amount}]` |

### 2.3 Orders
| Method | Endpoint | Query/Body | Notes |
|---|---|---|---|
| `GET` | `/api/orders` | `?client=&product=&stage=&date=&page=&limit=` | Paginated, filterable |
| `POST` | `/api/orders` | Full order object (see §3.1) | Multipart for file attachments |
| `GET` | `/api/orders/:id` | — | Full detail with payments, stages, attachments |
| `PATCH` | `/api/orders/:id/stage` | `{newStage, reason}` | Validate stage requirements |
| `POST` | `/api/orders/:id/payments` | `{type, amount, currency, date, proof, notes}` | File upload for proof |
| `POST` | `/api/orders/:id/attachments` | `{fileName, file}` | Multipart upload |
| `DELETE` | `/api/orders/:id/attachments/:attachId` | — | Requires ConfirmDanger modal |

### 2.4 Products
| Method | Endpoint | Query/Body |
|---|---|---|
| `GET` | `/api/products` | `?client=&category=&status=&page=&limit=` |
| `POST` | `/api/products` | Product creation payload |
| `GET` | `/api/products/:id` | Product detail |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Soft delete / archive |

### 2.5 Categories
| Method | Endpoint | Body |
|---|---|---|
| `GET` | `/api/categories` | — |
| `POST` | `/api/categories` | `{nameAr, nameEn, parentId, image}` |
| `PUT` | `/api/categories/:id` | `{nameAr, nameEn, parentId, image}` |
| `DELETE` | `/api/categories/:id` | Warning: unlinks associated products |

### 2.6 Customers
| Method | Endpoint | Query/Body |
|---|---|---|
| `GET` | `/api/customers` | `?country=&status=&debt=&page=&limit=` |
| `POST` | `/api/customers` | Customer creation payload |
| `GET` | `/api/customers/:id` | Detail: financial metrics, orders, top products, activity |
| `PUT` | `/api/customers/:id` | Update customer |
| `PATCH` | `/api/customers/:id/status` | `{status: 'active'|'inactive'}` |

### 2.7 Finance
| Method | Endpoint | Query |
|---|---|---|
| `GET` | `/api/finance/overview` | `?status=&product=&client=&date=` |
| `GET` | `/api/finance/stats` | 6 KPIs: revenue, paid, due, commissions generated/received/pending |
| `GET` | `/api/finance/charts/revenue` | Monthly revenue chart data |
| `GET` | `/api/finance/charts/paid-vs-due` | Bar chart data |
| `GET` | `/api/finance/charts/status-distribution` | Pie chart data |
| `GET` | `/api/finance/recent-transactions` | `[{id, amount, date, status}]` |
| `GET` | `/api/finance/commission-tracking` | `[{orderId, client, status}]` |

### 2.8 Transactions
| Method | Endpoint | Query/Body |
|---|---|---|
| `GET` | `/api/transactions` | `?paymentType=&status=&client=&dateRange=&page=&limit=` |
| `POST` | `/api/transactions` | `{orderId, paymentType, amount, currency, date, proof, notes}` |
| `PUT` | `/api/transactions/:id` | Edit payment |
| `PATCH` | `/api/transactions/:id/void` | Void with reason |
| `GET` | `/api/transactions/:id/receipt` | Download receipt file |
| `GET` | `/api/transactions/activity-log` | `?page=&limit=` — audit trail |

### 2.9 Commissions
| Method | Endpoint | Query |
|---|---|---|
| `GET` | `/api/commissions` | `?page=&limit=` |
| `GET` | `/api/commissions/:orderId` | Detail: summary + payment history |
| `GET` | `/api/commissions/stats` | 3 KPIs: total, received, remaining |

### 2.10 Users & Roles
| Method | Endpoint | Body |
|---|---|---|
| `GET` | `/api/users` | `?role=&status=&date=&page=&limit=` |
| `POST` | `/api/users` | User creation |
| `GET` | `/api/users/:id` | User detail |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |
| `POST` | `/api/users/:id/reset-password` | Admin-triggered password reset |
| `GET` | `/api/roles` | All roles with permissions |
| `POST` | `/api/roles` | `{name, description, permissions[]}` |
| `PUT` | `/api/roles/:id` | Update role |

### 2.11 Reports
| Method | Endpoint | Query |
|---|---|---|
| `GET` | `/api/reports/overview` | `?period=&client=&product=&status=` — KPIs + chart data |
| `GET` | `/api/reports/sales` | Charts + detailed orders table |
| `GET` | `/api/reports/financial` | Charts + client financial table |
| `GET` | `/api/reports/commissions` | KPIs + charts + commission table |
| `GET` | `/api/reports/export/pdf` | Generate PDF report |
| `GET` | `/api/reports/export/excel` | Generate Excel report |

### 2.12 Settings
| Method | Endpoint | Body |
|---|---|---|
| `GET` | `/api/settings` | All settings grouped by tab |
| `PUT` | `/api/settings/general` | `{systemName, companyName, logo, lang, timezone, dateFormat}` |
| `PUT` | `/api/settings/workflow` | `{stages[{id, title, mandatory, needsConfirm}]}` |
| `POST` | `/api/settings/workflow/stages` | Add new workflow stage |
| `PUT` | `/api/settings/financial` | `{defaultCommission, allowOverride, creditLimit, paymentTerms, delayAlertLimit}` |
| `PUT` | `/api/settings/currency` | `{defaultCurrency}` |
| `POST` | `/api/settings/currency` | Add new currency |
| `PATCH` | `/api/settings/currency/:id/rate` | Update exchange rate |
| `PUT` | `/api/settings/preferences` | `{darkMode, autoLogout, auditLog}` |

### 2.13 Profile & Notifications
| Method | Endpoint | Body |
|---|---|---|
| `GET` | `/api/profile` | Current user profile |
| `PUT` | `/api/profile` | `{fullName, email, phone}` |
| `PUT` | `/api/profile/password` | `{currentPassword, newPassword, confirmPassword}` |
| `POST` | `/api/profile/avatar` | File upload |
| `GET` | `/api/notifications` | `?page=&limit=` |
| `PATCH` | `/api/notifications/:id/read` | Mark as read |

---

## 3. Form Data Structures & Validation

### 3.1 Order Creation Form (`orders/new/page.jsx`)
```typescript
interface CreateOrderDTO {
  // Section 1: Order Info
  orderNumber: string;       // Auto-generated or manual
  client: string;            // Select from existing clients
  product: string;           // Select from existing products
  quantity: number;          // Required, > 0
  unitPrice: number;         // Required, > 0
  currency: 'EGP' | 'USD';  // Select
  totalPrice: number;        // Computed: quantity × unitPrice

  // Section 2: Commission
  commissionRate: number;    // Percentage (e.g. 5)
  commissionAmount: number;  // Computed: totalPrice × rate / 100
  commissionType: 'percentage' | 'fixed';

  // Section 3: Payment
  firstPayment: number;
  paymentDate: string;       // Date
  remaining: number;         // Computed: totalPrice - firstPayment

  // Section 4: Notes & Attachments
  notes: string;
  attachments: File[];       // PDF, JPG, PNG, Excel (max 10MB each)
}
```

### 3.2 Payment Form (PaymentModal / AddPaymentModal)
```typescript
interface CreatePaymentDTO {
  orderId: string;           // Select from orders
  paymentType: 'دفعة أولى' | 'دفعة نهائية' | 'عمولة' | 'دفعة جزئية';
  amount: number;
  currency: 'EGP' | 'USD';
  paymentDate: string;       // dd/mm/yy
  proofFile: File;           // PDF, JPG, PNG (max 10MB)
  notes: string;             // Reference number / notes
}
```

### 3.3 Stage Update Form
```typescript
interface UpdateStageDTO {
  currentStage: string;
  newStage: string;          // Select from workflow stages
  reason: string;            // Required text
  requirementsMet: boolean;  // Server validates stage prerequisites
}
```

### 3.4 Category Form
```typescript
interface CategoryDTO {
  nameAr: string;   // Required
  nameEn: string;   // Required
  parentId?: number; // Optional parent category
  image?: File;      // PNG/JPG
}
```

### 3.5 Role Form
```typescript
interface CreateRoleDTO {
  name: string;        // Required
  description: string; // Required
  permissions: string[]; // Array from available permissions
}
// Available permissions: ['اداره الطلبات', 'اداره المالية', 'اداره المنتجات', 'اداره العملاء', 'اداره التقارير', 'إدارة المستخدمين']
```

### 3.6 Settings Forms
```typescript
interface GeneralSettings {
  systemName: string;     // Required
  companyName: string;    // Required
  logo?: File;            // PNG/JPG, max 2MB
  lang: 'العربية' | 'English';
  timezone: string;
  dateFormat: string;
}

interface FinancialSettings {
  defaultCommission: number;
  allowOverride: boolean;
  creditLimit: boolean;
  paymentTerms: string;
  delayAlertLimit: string;
}

interface PreferencesSettings {
  darkMode: boolean;
  autoLogout: string;
  auditLog: boolean;
}
```

---

## 4. Business Logic to Implement Server-Side

### 4.1 Financial Calculations (Critical — must re-validate on server)
The frontend performs these calculations in `orders/new/page.jsx`:
- **Total Price** = `quantity × unitPrice`
- **Commission Amount** = `totalPrice × commissionRate / 100`
- **Remaining Balance** = `totalPrice - firstPayment`
- **Post-Payment Remaining** = `previousRemaining - newPaymentAmount`

> [!CAUTION]
> These calculations are currently done client-side only. The backend MUST re-compute and validate all financial values before persisting. Never trust client-submitted totals.

### 4.2 Stage Transition Rules
The `StageUpdateModal` enforces prerequisites before allowing stage changes:
- Each stage has a checklist of requirements (e.g., "manufacturing completed", "shipping company assigned", "tracking number entered")
- The submit button is disabled (gray/cursor-not-allowed) when requirements aren't met
- Backend must enforce: **a stage cannot advance unless all its prerequisites are fulfilled**

### 4.3 Permission System
The `Sidebar` component uses `hasPermission(permissionKey)` to show/hide navigation items. The backend must provide:
- User role with associated permissions on login
- Permission keys that map to: `orders`, `finance`, `products`, `customers`, `reports`, `users`
- Route-level guards on all API endpoints matching these permissions

### 4.4 File Upload Constraints
| Context | Accepted Types | Max Size |
|---|---|---|
| Order Attachments | PDF, JPG, PNG, DOC, DOCX, XLS, XLSX | 10 MB |
| Payment Proof | PDF, JPG, PNG | 10 MB |
| Category Image | PNG, JPG | Not specified (suggest 2MB) |
| Company Logo | PNG, JPG | 2 MB |
| Profile Avatar | Image | Not specified (suggest 2MB) |

---

## 5. Shared Components Architecture

### 5.1 Layout Components
| Component | File | Responsibility |
|---|---|---|
| `Header` | `components/dashboard/Header.jsx` | Search, notifications dropdown, profile dropdown, sidebar toggle. Accepts `title`, `subtitle`, `variant` props |
| `Sidebar` | `components/dashboard/Sidebar.jsx` | Permission-based navigation. Uses `SidebarContext` for open/close state |
| `SidebarContext` | `components/dashboard/SidebarContext.jsx` | React Context providing `{isOpen, toggle}` globally |

### 5.2 Modal Components
| Modal | File | Props | Trigger |
|---|---|---|---|
| `PaymentModal` | `modals/PaymentModal.jsx` | `{isOpen, onClose, onSubmit}` | Order detail page |
| `AddPaymentModal` | `modals/AddPaymentModal.jsx` | `{isOpen, onClose}` | Transactions page |
| `StageUpdateModal` | `modals/StageUpdateModal.jsx` | `{isOpen, onClose, onSubmit, currentStage}` | Order detail page |
| `UploadModal` | `modals/UploadModal.jsx` | `{isOpen, onClose, onSubmit}` | Order detail page |
| `ConfirmDangerModal` | `modals/ConfirmDangerModal.jsx` | `{isOpen, onClose, onConfirm, title, subtitle}` | Various delete actions |
| `AddRoleModal` | `modals/AddRoleModal.jsx` | `{isOpen, onClose}` | Roles page |
| `CommissionDetailsModal` | `modals/CommissionDetailsModal.jsx` | `{isOpen, onClose, data}` | Commissions page |

### 5.3 Auth Components
| Component | Source | Usage |
|---|---|---|
| `AuthHeader` | `AuthShared.jsx` | Title display for auth pages |
| `AuthInput` | `AuthShared.jsx` | Styled input with icon, optional password toggle |
| `AuthButton` | `AuthShared.jsx` | Primary submit button |
| `AuthDivider` | `AuthShared.jsx` | Visual separator |
| `ErrorBanner` | `AuthShared.jsx` | Red error message display |
| `SuccessBanner` | `AuthShared.jsx` | Green success message display |

### 5.4 Reusable UI
| Component | Source | Usage |
|---|---|---|
| `Modal` | `components/ui/Modal.jsx` | Base modal wrapper used by all modals |
| `ToggleSwitch` | Inline in `settings/page.jsx` | Boolean toggle (should be extracted) |

---

## 6. State Management Patterns (Current → Recommended)

### Current State
- **All forms** use local `useState` hooks
- **All submit handlers** log to `console.log` — no API calls
- **All data** comes from `MOCK_DATA` constants at the top of each file
- **No global state** management (no Redux, Zustand, or React Query)
- **No auth context** wrapping the app (mentioned in a previous conversation but not yet integrated)

### Recommended Backend Integration Pattern
```
1. Replace MOCK_DATA → API calls using React Query / SWR
2. Replace console.log handlers → mutation hooks with optimistic updates
3. Add AuthContext provider at root → stores JWT + user + permissions
4. Add route guards → redirect unauthenticated users to /login
5. Add error boundaries → handle API failures gracefully
```

---

## 7. Pagination Contract

All list pages expect this pagination response format:
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
}
```

Pages using pagination: Orders, Products, Customers, Users, Transactions, Commissions, Notifications.

---

## 8. Filter Contracts

### Orders Filters
`?client=string&product=string&stage=string&date=string&page=number&limit=number`

### Products Filters
`?client=string&category=string&status=active|archived&page=number&limit=number`

### Customers Filters
`?country=string&status=active|inactive&debt=has_debt|no_debt|all&page=number&limit=number`

### Users Filters
`?role=string&status=active|inactive&createdAt=date&page=number&limit=number`

### Transactions Filters
`?paymentType=string&status=string&client=string&dateRange=string&page=number&limit=number`

### Finance Filters
`?status=string&product=string&client=string&date=date`

### Reports Filters
`?period=string&client=string&product=string&status=string`

---

## 9. i18n Keys Used

The auth pages use `react-i18next` with keys like:
- `auth.login`, `auth.register`, `auth.forgotPassword`, `auth.resetPassword`
- `auth.emailUsername`, `auth.password`, `auth.confirmPassword`, `auth.fullName`
- `auth.rememberMe`, `auth.sendResetLink`, `auth.backToLogin`
- `auth.resetLinkSent`, `auth.passwordChanged`, `auth.newPassword`

Dashboard pages use **hardcoded Arabic text** — no i18n keys. If backend needs to support English dashboard, translation keys must be added.

---

## 10. Critical Integration Notes

> [!IMPORTANT]
> **Priority 1 — Auth Flow:** Build login/register/forgot-password/reset-password endpoints first. The entire app depends on JWT/session for route protection and permission-based rendering.

> [!IMPORTANT]
> **Priority 2 — Orders Module:** This is the core business logic. The order creation form has the most complex state (financial calculations, file uploads, multi-section form).

> [!WARNING]
> **Duplicate Components:** `PaymentModal` and `AddPaymentModal` serve similar purposes but have different implementations. The backend should expose a single `POST /api/transactions` endpoint that both can consume.

> [!WARNING]
> **No Input Validation on Frontend:** Forms currently have no client-side validation beyond HTML `required`. The backend MUST implement strict validation using `class-validator` or `Zod`.

> [!NOTE]
> **Workflow Stages** are configurable via Settings. The backend should store stages in a DB table, not hardcode them. Stage transitions should be validated against the configured workflow.

> [!NOTE]
> **Currency Support:** The system supports multiple currencies (EGP, USD, SAR, AED, EUR) with configurable exchange rates. Financial calculations should account for currency conversion.

# Milestone Feature Specification

## Overview

Milestone adalah fitur untuk tracking financial journey timeline dimana user dapat mendefinisikan moment-moment penting dalam perjalanan keuangan mereka dengan kondisi tertentu. Sistem akan membandingkan target timeline dengan realitas pencapaian.

---

## Database Schema

### Table: `milestones`

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PRIMARY KEY | Unique identifier for the milestone. |
| `name` | string | | Name/title of the milestone (e.g., "Emergency Fund Complete"). |
| `description` | text | NULLABLE | Detailed description of the milestone. |
| `icon` | string | NULLABLE | Icon identifier for UI (e.g., "home-outline", "trophy-outline"). |
| `color` | string | NULLABLE | Hex color code for UI visualization. |
| `conditions` | jsonb[] | | Array of condition objects (multiple conditions supported). |
| `target_date` | date | | Target date when milestone should be achieved. |
| `achieved_at` | date | NULLABLE | Actual date when milestone was achieved. |
| `status` | enum | DEFAULT: 'pending' | Current status: 'pending', 'in_progress', 'achieved', 'failed', 'cancelled'. |
| `user_id` | uuid | FOREIGN KEY to `users.id` | The user who owns this milestone. |
| `created_at` | timestamp | | Timestamp of when the milestone was created. |
| `updated_at` | timestamp | | Timestamp of when the milestone was last updated. |

**Relations:**
- Belongs to one `user`

**Indexes:**
- Index on `user_id`
- Index on `status`
- Index on `target_date`

---

## Condition Types & Configurations

### 1. Wallet Balance (`wallet_balance`)

**Description:** Check if a specific wallet or total wallet balance reaches target amount.

**Configuration:**
```json
{
  "type": "wallet_balance",
  "config": {
    "wallet_id": "uuid-wallet-id or null for all wallets",
    "operator": ">= | > | <= | < | =",
    "target_amount": 100000000
  }
}
```

**Examples:**
- "Wallet 'Tabungan Rumah' mencapai Rp 100 juta"
  ```json
  {
    "type": "wallet_balance",
    "config": {
      "wallet_id": "wallet-123",
      "operator": ">=",
      "target_amount": 100000000
    }
  }
  ```

- "Total saldo semua wallet mencapai Rp 500 juta"
  ```json
  {
    "type": "wallet_balance",
    "config": {
      "wallet_id": null,
      "operator": ">=",
      "target_amount": 500000000
    }
  }
  ```

**Progress Calculation:**
```
current_value = current wallet balance
target_value = target_amount
progress_percentage = (current_value / target_value) * 100
is_met = evaluate operator condition
```

---

### 2. Budget Control (`budget_control`)

**Description:** Check if budget is maintained without overspending for consecutive periods.

**Configuration:**
```json
{
  "type": "budget_control",
  "config": {
    "budget_id": "uuid-budget-id",
    "condition": "no_overspend | under_percentage",
    "consecutive_months": 3,
    "percentage": 80
  }
}
```

**Fields:**
- `budget_id`: Target budget to monitor
- `condition`:
  - `no_overspend`: Budget tidak boleh overspend
  - `under_percentage`: Spending harus di bawah X% dari limit
- `consecutive_months`: Jumlah bulan berturut-turut (optional, default: 1)
- `percentage`: Required if condition is `under_percentage` (e.g., 80 = spending harus ≤ 80% dari limit)

**Examples:**
- "Budget 'Monthly Expense' tidak overspend selama 3 bulan berturut-turut"
  ```json
  {
    "type": "budget_control",
    "config": {
      "budget_id": "budget-123",
      "condition": "no_overspend",
      "consecutive_months": 3
    }
  }
  ```

- "Budget 'Groceries' spending di bawah 80% limit selama 2 bulan"
  ```json
  {
    "type": "budget_control",
    "config": {
      "budget_id": "budget-456",
      "condition": "under_percentage",
      "consecutive_months": 2,
      "percentage": 80
    }
  }
  ```

**Progress Calculation:**
```
current_value = number of consecutive months met
target_value = consecutive_months config
progress_percentage = (current_value / target_value) * 100
is_met = current_value >= target_value
```

---

### 3. Single Transaction Amount (`transaction_amount`)

**Description:** Check if there's a single transaction that meets amount criteria.

**Configuration:**
```json
{
  "type": "transaction_amount",
  "config": {
    "transaction_type": "income | expense",
    "operator": ">= | > | <= | < | =",
    "amount": 10000000,
    "category_id": "uuid-category-id or null"
  }
}
```

**Fields:**
- `transaction_type`: Type of transaction (income/expense)
- `operator`: Comparison operator
- `amount`: Target amount
- `category_id`: Optional, filter by specific category

**Examples:**
- "Dapat bonus/income ≥ Rp 10 juta dalam 1 transaksi"
  ```json
  {
    "type": "transaction_amount",
    "config": {
      "transaction_type": "income",
      "operator": ">=",
      "amount": 10000000,
      "category_id": null
    }
  }
  ```

- "Ada expense category 'Liburan' ≥ Rp 20 juta (bukti jalan-jalan)"
  ```json
  {
    "type": "transaction_amount",
    "config": {
      "transaction_type": "expense",
      "operator": ">=",
      "amount": 20000000,
      "category_id": "category-liburan"
    }
  }
  ```

**Progress Calculation:**
```
current_value = highest transaction amount found (or 0 if none)
target_value = amount config
progress_percentage = (current_value / target_value) * 100 (max 100)
is_met = check if any transaction meets the criteria
```

---

### 4. Period Total (`period_total`)

**Description:** Check if total income/expense in a period meets target.

**Configuration:**
```json
{
  "type": "period_total",
  "config": {
    "transaction_type": "income | expense",
    "operator": ">= | > | <= | < | =",
    "amount": 50000000,
    "period": "month | quarter | year | custom",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "category_id": "uuid-category-id or null"
  }
}
```

**Fields:**
- `transaction_type`: Type of transaction (income/expense)
- `operator`: Comparison operator
- `amount`: Target total amount
- `period`: Period type (month = current month, quarter, year, custom)
- `start_date`: Required if period is 'custom'
- `end_date`: Required if period is 'custom'
- `category_id`: Optional, filter by category

**Examples:**
- "Total income tahun ini ≥ Rp 150 juta"
  ```json
  {
    "type": "period_total",
    "config": {
      "transaction_type": "income",
      "operator": ">=",
      "amount": 150000000,
      "period": "year",
      "category_id": null
    }
  }
  ```

- "Total expense bulan ini ≤ Rp 8 juta"
  ```json
  {
    "type": "period_total",
    "config": {
      "transaction_type": "expense",
      "operator": "<=",
      "amount": 8000000,
      "period": "month",
      "category_id": null
    }
  }
  ```

- "Total saving dari Jan-Dec 2025 ≥ Rp 100 juta"
  ```json
  {
    "type": "period_total",
    "config": {
      "transaction_type": "income",
      "operator": ">=",
      "amount": 100000000,
      "period": "custom",
      "start_date": "2025-01-01",
      "end_date": "2025-12-31",
      "category_id": null
    }
  }
  ```

**Progress Calculation:**
```
current_value = sum of transactions in period
target_value = amount config
progress_percentage = (current_value / target_value) * 100
is_met = evaluate operator condition
```

---

### 5. Net Worth (`net_worth`)

**Description:** Check if total net worth (total income - total expense) reaches target.

**Configuration:**
```json
{
  "type": "net_worth",
  "config": {
    "operator": ">= | > | <= | < | =",
    "target_amount": 500000000,
    "include_hidden_wallets": false
  }
}
```

**Fields:**
- `operator`: Comparison operator
- `target_amount`: Target net worth
- `include_hidden_wallets`: Whether to include hidden wallets in calculation

**Examples:**
- "Net worth mencapai Rp 500 juta"
  ```json
  {
    "type": "net_worth",
    "config": {
      "operator": ">=",
      "target_amount": 500000000,
      "include_hidden_wallets": false
    }
  }
  ```

**Progress Calculation:**
```
current_value = sum of all wallet balances (excluding/including hidden based on config)
target_value = target_amount
progress_percentage = (current_value / target_value) * 100
is_met = evaluate operator condition
```

---

### 6. Category Spending Limit (`category_spending`)

**Description:** Check if spending on specific category stays within limit for a period.

**Configuration:**
```json
{
  "type": "category_spending",
  "config": {
    "category_id": "uuid-category-id",
    "operator": ">= | > | <= | < | =",
    "amount": 5000000,
    "period": "month | quarter | year"
  }
}
```

**Fields:**
- `category_id`: Target category to monitor
- `operator`: Comparison operator
- `amount`: Spending limit
- `period`: Time period to check

**Examples:**
- "Spending kategori 'Makan' bulan ini ≤ Rp 3 juta"
  ```json
  {
    "type": "category_spending",
    "config": {
      "category_id": "category-makan",
      "operator": "<=",
      "amount": 3000000,
      "period": "month"
    }
  }
  ```

**Progress Calculation:**
```
current_value = sum of expenses in category for period
target_value = amount config
progress_percentage = 100 - ((current_value / target_value) * 100) for <= operator
                     = (current_value / target_value) * 100 for >= operator
is_met = evaluate operator condition
```

---

## API Endpoints

### Create a new milestone

`POST /milestones`

**Request Body:**
```json
{
  "name": "Emergency Fund Complete",
  "description": "Build emergency fund untuk 6 bulan pengeluaran",
  "icon": "shield-checkmark-outline",
  "color": "#26de81",
  "conditions": [
    {
      "type": "wallet_balance",
      "config": {
        "wallet_id": "wallet-123",
        "operator": ">=",
        "target_amount": 30000000
      }
    }
  ],
  "target_date": "2025-12-31"
}
```

**Response:** `201 Created`
```json
{
  "id": "milestone-123",
  "name": "Emergency Fund Complete",
  "description": "Build emergency fund untuk 6 bulan pengeluaran",
  "icon": "shield-checkmark-outline",
  "color": "#26de81",
  "conditions": [...],
  "target_date": "2025-12-31",
  "achieved_at": null,
  "status": "pending",
  "user_id": "user-123",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### Get all milestones with progress

`GET /milestones`

**Query Parameters:**
- `status` (optional): Filter by status (pending, in_progress, achieved, failed, cancelled)
- `sort_by` (optional): Sort field (target_date, created_at, name) - default: target_date
- `order` (optional): Sort order (ASC, DESC) - default: ASC

**Response:** `200 OK`
```json
[
  {
    "id": "milestone-123",
    "name": "Emergency Fund Complete",
    "description": "Build emergency fund untuk 6 bulan pengeluaran",
    "icon": "shield-checkmark-outline",
    "color": "#26de81",
    "conditions": [
      {
        "id": "cond_1",
        "type": "wallet_balance",
        "config": {
          "wallet_id": "wallet-123",
          "operator": ">=",
          "target_amount": 30000000
        },
        "current_value": 18500000,
        "target_value": 30000000,
        "progress_percentage": 61.67,
        "is_met": false
      }
    ],
    "target_date": "2025-12-31",
    "achieved_at": null,
    "status": "in_progress",
    "overall_progress": 61.67,
    "user_id": "user-123",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
]
```

---

### Get a specific milestone by ID

`GET /milestones/:id`

**Response:** `200 OK`
```json
{
  "id": "milestone-123",
  "name": "Emergency Fund Complete",
  "description": "Build emergency fund untuk 6 bulan pengeluaran",
  "icon": "shield-checkmark-outline",
  "color": "#26de81",
  "conditions": [
    {
      "id": "cond_1",
      "type": "wallet_balance",
      "config": {
        "wallet_id": "wallet-123",
        "operator": ">=",
        "target_amount": 30000000
      },
      "current_value": 18500000,
      "target_value": 30000000,
      "progress_percentage": 61.67,
      "is_met": false
    }
  ],
  "target_date": "2025-12-31",
  "achieved_at": null,
  "status": "in_progress",
  "overall_progress": 61.67,
  "user_id": "user-123",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### Update a milestone

`PATCH /milestones/:id`

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "icon": "new-icon",
  "color": "#ff0000",
  "conditions": [...],
  "target_date": "2026-01-01"
}
```

**Response:** `200 OK`

---

### Delete a milestone

`DELETE /milestones/:id`

**Response:** `204 No Content`

---

### Manually update milestone status

`PATCH /milestones/:id/status`

**Request Body:**
```json
{
  "status": "achieved | failed | cancelled"
}
```

**Response:** `200 OK`

---

### Force check progress (refresh)

`GET /milestones/:id/check-progress`

**Response:** `200 OK`
Returns milestone with freshly calculated progress.

---

## DTOs (Data Transfer Objects)

### CreateMilestoneDto

```typescript
{
  name: string; // Required, min 1 char
  description?: string;
  icon?: string;
  color?: string; // Hex color format
  conditions: ConditionDto[]; // Required, min 1 condition
  target_date: Date; // Required, must be future date
}
```

### UpdateMilestoneDto

```typescript
{
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions?: ConditionDto[];
  target_date?: Date;
}
```

### ConditionDto

```typescript
{
  type: 'wallet_balance' | 'budget_control' | 'transaction_amount' | 'period_total' | 'net_worth' | 'category_spending';
  config: object; // Depends on type, see condition configurations above
}
```

### UpdateStatusDto

```typescript
{
  status: 'achieved' | 'failed' | 'cancelled';
}
```

### MilestoneResponseDto

```typescript
{
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions: ConditionWithProgressDto[];
  target_date: Date;
  achieved_at?: Date;
  status: 'pending' | 'in_progress' | 'achieved' | 'failed' | 'cancelled';
  overall_progress: number; // 0-100
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
```

### ConditionWithProgressDto

```typescript
{
  id: string;
  type: string;
  config: object;
  current_value: number | boolean;
  target_value: number | boolean;
  progress_percentage: number; // 0-100
  is_met: boolean;
}
```

---

## Business Logic

### Status Determination

The milestone status is automatically determined based on conditions:

1. **`pending`**: No progress yet (overall_progress = 0%)
2. **`in_progress`**: Some progress made (0% < overall_progress < 100%)
3. **`achieved`**: All conditions met (all is_met = true)
4. **`failed`**: Target date passed but not achieved
5. **`cancelled`**: Manually cancelled by user

### Overall Progress Calculation

```javascript
overall_progress = average(all_conditions.progress_percentage)
```

Example:
- Condition 1: 80% progress
- Condition 2: 60% progress
- Overall: (80 + 60) / 2 = 70%

### Auto Status Update (On-Demand)

When FE requests milestone data, the system will:

```javascript
// Calculate current progress for all conditions
for each condition:
  calculate current_value
  calculate progress_percentage
  check is_met

// Determine status
if all conditions.is_met == true:
  status = 'achieved'
  achieved_at = now() // if not already set
else if any condition.progress_percentage > 0:
  status = 'in_progress'
else if target_date < today AND status != 'achieved':
  status = 'failed'
else:
  status = 'pending'
```

---

## Validation Rules

### Milestone Validation
- `name`: Required, min 1 character, max 200 characters
- `description`: Optional, max 1000 characters
- `icon`: Optional, max 50 characters
- `color`: Optional, must be valid hex color (#RRGGBB)
- `conditions`: Required, must have at least 1 condition, max 10 conditions
- `target_date`: Required, must be a valid date (can be past or future)

### Condition Validation

Each condition type has specific validation rules based on its config:

**wallet_balance:**
- `wallet_id`: Must be valid UUID or null
- `operator`: Must be one of: >=, >, <=, <, =
- `target_amount`: Must be positive number

**budget_control:**
- `budget_id`: Required, must be valid UUID
- `condition`: Must be 'no_overspend' or 'under_percentage'
- `consecutive_months`: Optional, must be positive integer (1-12)
- `percentage`: Required if condition is 'under_percentage', must be 1-100

**transaction_amount:**
- `transaction_type`: Must be 'income' or 'expense'
- `operator`: Must be one of: >=, >, <=, <, =
- `amount`: Must be positive number
- `category_id`: Optional, must be valid UUID if provided

**period_total:**
- `transaction_type`: Must be 'income' or 'expense'
- `operator`: Must be one of: >=, >, <=, <, =
- `amount`: Must be positive number
- `period`: Must be 'month', 'quarter', 'year', or 'custom'
- `start_date`: Required if period is 'custom'
- `end_date`: Required if period is 'custom', must be after start_date
- `category_id`: Optional, must be valid UUID if provided

**net_worth:**
- `operator`: Must be one of: >=, >, <=, <, =
- `target_amount`: Must be positive number
- `include_hidden_wallets`: Must be boolean

**category_spending:**
- `category_id`: Required, must be valid UUID
- `operator`: Must be one of: >=, >, <=, <, =
- `amount`: Must be positive number
- `period`: Must be 'month', 'quarter', or 'year'

---

## Example Use Cases

### Use Case 1: Simple Savings Goal

**Milestone:** "Emergency Fund - 6 Months Expenses"

```json
{
  "name": "Emergency Fund - 6 Months Expenses",
  "description": "Build emergency fund covering 6 months of living expenses",
  "icon": "shield-checkmark-outline",
  "color": "#26de81",
  "conditions": [
    {
      "type": "wallet_balance",
      "config": {
        "wallet_id": "wallet-emergency-fund",
        "operator": ">=",
        "target_amount": 30000000
      }
    }
  ],
  "target_date": "2025-12-31"
}
```

---

### Use Case 2: Multiple Conditions - Financial Discipline

**Milestone:** "Financial Stability Q1 2025"

```json
{
  "name": "Financial Stability Q1 2025",
  "description": "Maintain financial discipline throughout Q1",
  "icon": "trophy-outline",
  "color": "#ff6b6b",
  "conditions": [
    {
      "type": "budget_control",
      "config": {
        "budget_id": "budget-monthly",
        "condition": "no_overspend",
        "consecutive_months": 3
      }
    },
    {
      "type": "category_spending",
      "config": {
        "category_id": "category-entertainment",
        "operator": "<=",
        "amount": 2000000,
        "period": "month"
      }
    },
    {
      "type": "period_total",
      "config": {
        "transaction_type": "expense",
        "operator": "<=",
        "amount": 15000000,
        "period": "month",
        "category_id": null
      }
    }
  ],
  "target_date": "2025-03-31"
}
```

---

### Use Case 3: Big Purchase Goal

**Milestone:** "Down Payment for House"

```json
{
  "name": "Down Payment for House",
  "description": "Save Rp 200 juta untuk DP rumah",
  "icon": "home-outline",
  "color": "#45aaf2",
  "conditions": [
    {
      "type": "wallet_balance",
      "config": {
        "wallet_id": "wallet-house-savings",
        "operator": ">=",
        "target_amount": 200000000
      }
    }
  ],
  "target_date": "2027-12-31"
}
```

---

### Use Case 4: Income Achievement

**Milestone:** "Career Growth - First Big Bonus"

```json
{
  "name": "Career Growth - First Big Bonus",
  "description": "Receive bonus or income ≥ Rp 20 juta",
  "icon": "briefcase-outline",
  "color": "#ffa502",
  "conditions": [
    {
      "type": "transaction_amount",
      "config": {
        "transaction_type": "income",
        "operator": ">=",
        "amount": 20000000,
        "category_id": "category-bonus"
      }
    }
  ],
  "target_date": "2025-12-31"
}
```

---

### Use Case 5: Net Worth Target

**Milestone:** "Become Crorepati (Net Worth 500M)"

```json
{
  "name": "Net Worth Rp 500 Juta",
  "description": "Achieve net worth of Rp 500 million",
  "icon": "cash-outline",
  "color": "#2ed573",
  "conditions": [
    {
      "type": "net_worth",
      "config": {
        "operator": ">=",
        "target_amount": 500000000,
        "include_hidden_wallets": false
      }
    }
  ],
  "target_date": "2030-12-31"
}
```

---

## Frontend Implementation Guide

### Step 1: Create Milestone Form

```javascript
// Template dropdown options
const conditionTemplates = [
  {
    value: 'wallet_balance',
    label: 'Saldo Wallet Mencapai Target',
    icon: 'wallet-outline'
  },
  {
    value: 'budget_control',
    label: 'Budget Tidak Overspend',
    icon: 'shield-checkmark-outline'
  },
  {
    value: 'transaction_amount',
    label: 'Dapat Income/Expense Tertentu',
    icon: 'cash-outline'
  },
  {
    value: 'period_total',
    label: 'Total Income/Expense Periode',
    icon: 'calendar-outline'
  },
  {
    value: 'net_worth',
    label: 'Net Worth Target',
    icon: 'trending-up-outline'
  },
  {
    value: 'category_spending',
    label: 'Limit Spending Kategori',
    icon: 'pricetag-outline'
  }
];

// Dynamic form based on selected template
function renderConditionForm(selectedType) {
  switch(selectedType) {
    case 'wallet_balance':
      return (
        <>
          <Select label="Wallet" options={wallets} />
          <Select label="Operator" options={['>=', '>', '<=', '<', '=']} />
          <Input label="Target Amount" type="number" />
        </>
      );

    case 'budget_control':
      return (
        <>
          <Select label="Budget" options={budgets} />
          <Select label="Kondisi" options={['no_overspend', 'under_percentage']} />
          <Input label="Consecutive Months" type="number" />
          {/* Show percentage input if under_percentage selected */}
        </>
      );

    // ... other cases
  }
}
```

### Step 2: Display Timeline

```javascript
// Fetch milestones
const milestones = await fetch('/milestones?sort_by=target_date&order=ASC');

// Group by status for better visualization
const grouped = {
  achieved: milestones.filter(m => m.status === 'achieved'),
  in_progress: milestones.filter(m => m.status === 'in_progress'),
  pending: milestones.filter(m => m.status === 'pending'),
  failed: milestones.filter(m => m.status === 'failed')
};

// Render timeline
<Timeline>
  {milestones.map(milestone => (
    <TimelineItem
      key={milestone.id}
      title={milestone.name}
      date={milestone.target_date}
      achievedDate={milestone.achieved_at}
      progress={milestone.overall_progress}
      status={milestone.status}
      icon={milestone.icon}
      color={milestone.color}
    />
  ))}
</Timeline>
```

### Step 3: Display Progress

```javascript
<MilestoneCard milestone={milestone}>
  <h3>{milestone.name}</h3>
  <p>{milestone.description}</p>

  {/* Overall Progress */}
  <ProgressBar value={milestone.overall_progress} />

  {/* Individual Conditions */}
  {milestone.conditions.map(condition => (
    <ConditionProgress
      key={condition.id}
      type={condition.type}
      currentValue={condition.current_value}
      targetValue={condition.target_value}
      progress={condition.progress_percentage}
      isMet={condition.is_met}
    />
  ))}

  {/* Target vs Achieved Date */}
  <DateComparison
    targetDate={milestone.target_date}
    achievedDate={milestone.achieved_at}
    status={milestone.status}
  />
</MilestoneCard>
```

---

## Error Handling

### Error Responses

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "name should not be empty",
    "conditions must contain at least 1 element"
  ]
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Milestone not found"
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "You don't have permission to access this milestone"
}
```

---

## Performance Considerations

### On-Demand Calculation

Since progress is calculated on-demand (when FE requests), consider:

1. **Caching:** Cache calculation results for a short period (e.g., 5 minutes) to avoid repeated calculations
2. **Indexing:** Ensure proper database indexes on frequently queried fields
3. **Pagination:** For users with many milestones, implement pagination
4. **Selective Loading:** Option to load milestones without progress calculation for list views

### Optimization Tips

```javascript
// Option 1: Quick list view (no progress calculation)
GET /milestones?include_progress=false

// Option 2: Full detail (with progress)
GET /milestones/:id
```

---

## Future Enhancements (Phase 2)

### 1. Recurring Milestones
- Support for recurring milestones (e.g., "No overspend every month")
- Auto-create next milestone when current is achieved

### 2. Milestone Templates
- Pre-defined milestone templates for common goals
- Community-shared templates

### 3. Insights & Analytics
- "On track" or "Behind schedule" indicators
- Suggestions to achieve milestone faster
- Historical trend analysis

### 4. Social Features
- Share milestone achievements
- Milestone challenges with friends

### 5. Smart Notifications (if needed later)
- Progress milestones (25%, 50%, 75%)
- Achievement notifications
- Deadline reminders

---

## Migration Notes

When implementing this feature:

1. Create migration for `milestones` table
2. Add necessary indexes
3. Create enum type for `status`
4. Consider data migration if converting from any existing goal/target feature

---

## Testing Checklist

### Unit Tests
- [ ] Condition validation for each type
- [ ] Progress calculation for each condition type
- [ ] Status determination logic
- [ ] Overall progress calculation

### Integration Tests
- [ ] Create milestone with single condition
- [ ] Create milestone with multiple conditions
- [ ] Get milestones with progress calculation
- [ ] Update milestone
- [ ] Delete milestone
- [ ] Manual status update
- [ ] Check progress endpoint

### Edge Cases
- [ ] Milestone with invalid wallet_id
- [ ] Milestone with invalid budget_id
- [ ] Milestone with past target_date
- [ ] Division by zero in progress calculation
- [ ] Multiple conditions with different progress values
- [ ] Achieved milestone shouldn't change status back

---

## Conclusion

This milestone feature provides a flexible and powerful way for users to track their financial journey. The hybrid approach allows for both predefined templates (ease of use) and custom configurations (flexibility), while on-demand progress calculation ensures accurate real-time data without performance overhead.

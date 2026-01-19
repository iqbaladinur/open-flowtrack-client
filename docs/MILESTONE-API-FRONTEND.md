# Milestone API - Frontend Documentation

Dokumentasi API untuk fitur Milestone yang dioptimasi untuk implementasi frontend.

---

## Base URL

```
Production: https://api.wallport.com
Development: http://localhost:3000
```

## Authentication

Semua endpoint memerlukan Bearer Token:

```
Authorization: Bearer {your_access_token}
```

---

## 📋 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/milestones` | Create new milestone |
| GET | `/milestones` | Get all milestones with progress |
| GET | `/milestones/:id` | Get single milestone with progress |
| PATCH | `/milestones/:id` | Update milestone |
| DELETE | `/milestones/:id` | Delete milestone |
| PATCH | `/milestones/:id/status` | Manually update status |
| GET | `/milestones/:id/check-progress` | Force refresh progress |

---

## 1. Create Milestone

**Endpoint:** `POST /milestones`

### Request

```typescript
{
  name: string;                    // Required, max 200 chars
  description?: string;             // Optional, max 1000 chars
  icon?: string;                    // Optional, max 50 chars (e.g., "shield-checkmark-outline")
  color?: string;                   // Optional, hex color (e.g., "#26de81")
  conditions: ConditionDto[];       // Required, min 1, max 10 conditions
  target_date: string;              // Required, ISO date (e.g., "2025-12-31")
}
```

### Example: Simple Savings Goal

```json
{
  "name": "Emergency Fund - 30 Juta",
  "description": "Tabungan darurat untuk 6 bulan pengeluaran",
  "icon": "shield-checkmark-outline",
  "color": "#26de81",
  "conditions": [
    {
      "type": "wallet_balance",
      "config": {
        "wallet_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "operator": ">=",
        "target_amount": 30000000
      }
    }
  ],
  "target_date": "2025-12-31"
}
```

### Example: Multiple Conditions

```json
{
  "name": "Financial Discipline Q1 2025",
  "description": "Maintain financial discipline throughout Q1",
  "icon": "trophy-outline",
  "color": "#ff6b6b",
  "conditions": [
    {
      "type": "budget_control",
      "config": {
        "budget_id": "budget-uuid-123",
        "condition": "no_overspend",
        "consecutive_months": 3
      }
    },
    {
      "type": "category_spending",
      "config": {
        "category_id": "category-entertainment-uuid",
        "operator": "<=",
        "amount": 2000000,
        "period": "month"
      }
    }
  ],
  "target_date": "2025-03-31"
}
```

### Response: 201 Created

```json
{
  "id": "milestone-uuid-123",
  "name": "Emergency Fund - 30 Juta",
  "description": "Tabungan darurat untuk 6 bulan pengeluaran",
  "icon": "shield-checkmark-outline",
  "color": "#26de81",
  "conditions": [
    {
      "id": "condition-uuid-1",
      "type": "wallet_balance",
      "config": {
        "wallet_id": "wallet-uuid",
        "operator": ">=",
        "target_amount": 30000000
      }
    }
  ],
  "target_date": "2025-12-31T00:00:00.000Z",
  "achieved_at": null,
  "status": "pending",
  "user_id": "user-uuid",
  "created_at": "2025-01-17T10:00:00.000Z",
  "updated_at": "2025-01-17T10:00:00.000Z"
}
```

---

## 2. Get All Milestones

**Endpoint:** `GET /milestones`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | enum | No | - | Filter by status: `pending`, `in_progress`, `achieved`, `failed`, `cancelled` |
| `sort_by` | enum | No | `target_date` | Sort field: `target_date`, `created_at`, `name` |
| `order` | enum | No | `ASC` | Sort order: `ASC`, `DESC` |

### Example Request

```
GET /milestones?status=in_progress&sort_by=target_date&order=ASC
```

### Response: 200 OK

```json
[
  {
    "id": "milestone-1",
    "name": "Emergency Fund - 30 Juta",
    "description": "Tabungan darurat untuk 6 bulan pengeluaran",
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
    "target_date": "2025-12-31T00:00:00.000Z",
    "achieved_at": null,
    "status": "in_progress",
    "overall_progress": 61.67,
    "user_id": "user-123",
    "created_at": "2025-01-17T10:00:00.000Z",
    "updated_at": "2025-01-17T10:00:00.000Z"
  },
  {
    "id": "milestone-2",
    "name": "First Big Bonus",
    "description": "Receive bonus >= 20 juta",
    "icon": "cash-outline",
    "color": "#ffa502",
    "conditions": [
      {
        "id": "cond_1",
        "type": "transaction_amount",
        "config": {
          "transaction_type": "income",
          "operator": ">=",
          "amount": 20000000,
          "category_id": "category-bonus"
        },
        "current_value": 15000000,
        "target_value": 20000000,
        "progress_percentage": 75,
        "is_met": false
      }
    ],
    "target_date": "2025-12-31T00:00:00.000Z",
    "achieved_at": null,
    "status": "in_progress",
    "overall_progress": 75,
    "user_id": "user-123",
    "created_at": "2025-01-17T10:00:00.000Z",
    "updated_at": "2025-01-17T10:00:00.000Z"
  }
]
```

---

## 3. Get Single Milestone

**Endpoint:** `GET /milestones/:id`

### Example Request

```
GET /milestones/milestone-uuid-123
```

### Response: 200 OK

Same structure as single item in Get All response.

### Response: 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Milestone not found"
}
```

---

## 4. Update Milestone

**Endpoint:** `PATCH /milestones/:id`

### Request Body

All fields are optional (partial update):

```typescript
{
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions?: ConditionDto[];
  target_date?: string;
}
```

### Example Request

```json
{
  "name": "Emergency Fund - Updated to 50 Juta",
  "conditions": [
    {
      "type": "wallet_balance",
      "config": {
        "wallet_id": "wallet-uuid",
        "operator": ">=",
        "target_amount": 50000000
      }
    }
  ]
}
```

### Response: 200 OK

Returns updated milestone with recalculated progress.

---

## 5. Delete Milestone

**Endpoint:** `DELETE /milestones/:id`

### Example Request

```
DELETE /milestones/milestone-uuid-123
```

### Response: 204 No Content

No response body.

---

## 6. Update Status Manually

**Endpoint:** `PATCH /milestones/:id/status`

Untuk manually mark milestone sebagai achieved/failed/cancelled.

### Request Body

```json
{
  "status": "achieved" | "failed" | "cancelled"
}
```

### Example: Mark as Achieved

```json
{
  "status": "achieved"
}
```

### Response: 200 OK

Returns milestone with updated status. If status is `achieved`, `achieved_at` will be set to current timestamp.

---

## 7. Force Refresh Progress

**Endpoint:** `GET /milestones/:id/check-progress`

Force recalculate progress. Berguna jika user ingin refresh data terbaru.

### Example Request

```
GET /milestones/milestone-uuid-123/check-progress
```

### Response: 200 OK

Returns milestone with freshly calculated progress (same as Get Single Milestone).

---

## 📊 Condition Types Reference

### 1. Wallet Balance

Target saldo wallet mencapai nilai tertentu.

```typescript
{
  type: "wallet_balance",
  config: {
    wallet_id: string | null,        // null = all wallets
    operator: ">=" | ">" | "<=" | "<" | "=",
    target_amount: number
  }
}
```

**Example:**
```json
{
  "type": "wallet_balance",
  "config": {
    "wallet_id": "wallet-uuid-123",
    "operator": ">=",
    "target_amount": 100000000
  }
}
```

**Progress Calculation:**
- `current_value`: Current wallet balance
- `target_value`: target_amount from config
- `progress_percentage`: (current / target) × 100
- `is_met`: true if operator condition is satisfied

---

### 2. Budget Control

Budget tidak overspend untuk periode tertentu.

```typescript
{
  type: "budget_control",
  config: {
    budget_id: string,
    condition: "no_overspend" | "under_percentage",
    consecutive_months?: number,     // Default: 1
    percentage?: number              // Required if condition = "under_percentage"
  }
}
```

**Example: No Overspend**
```json
{
  "type": "budget_control",
  "config": {
    "budget_id": "budget-uuid-123",
    "condition": "no_overspend",
    "consecutive_months": 3
  }
}
```

**Example: Under Percentage**
```json
{
  "type": "budget_control",
  "config": {
    "budget_id": "budget-uuid-123",
    "condition": "under_percentage",
    "consecutive_months": 2,
    "percentage": 80
  }
}
```

**Progress Calculation:**
- `current_value`: Number of consecutive months met
- `target_value`: consecutive_months from config
- `progress_percentage`: (current / target) × 100
- `is_met`: true if consecutive months requirement is met

---

### 3. Transaction Amount

Single transaction mencapai nominal tertentu.

```typescript
{
  type: "transaction_amount",
  config: {
    transaction_type: "income" | "expense",
    operator: ">=" | ">" | "<=" | "<" | "=",
    amount: number,
    category_id?: string             // Optional
  }
}
```

**Example:**
```json
{
  "type": "transaction_amount",
  "config": {
    "transaction_type": "income",
    "operator": ">=",
    "amount": 20000000,
    "category_id": "category-bonus-uuid"
  }
}
```

**Progress Calculation:**
- `current_value`: Highest transaction amount found (or 0)
- `target_value`: amount from config
- `progress_percentage`: (current / target) × 100 (max 100)
- `is_met`: true if any transaction meets criteria

---

### 4. Period Total

Total income/expense dalam periode mencapai target.

```typescript
{
  type: "period_total",
  config: {
    transaction_type: "income" | "expense",
    operator: ">=" | ">" | "<=" | "<" | "=",
    amount: number,
    period: "month" | "quarter" | "year" | "custom",
    start_date?: string,             // Required if period = "custom"
    end_date?: string,               // Required if period = "custom"
    category_id?: string             // Optional
  }
}
```

**Example: This Month**
```json
{
  "type": "period_total",
  "config": {
    "transaction_type": "expense",
    "operator": "<=",
    "amount": 8000000,
    "period": "month"
  }
}
```

**Example: Custom Period**
```json
{
  "type": "period_total",
  "config": {
    "transaction_type": "income",
    "operator": ">=",
    "amount": 150000000,
    "period": "custom",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31"
  }
}
```

**Progress Calculation:**
- `current_value`: Sum of transactions in period
- `target_value`: amount from config
- `progress_percentage`: (current / target) × 100
- `is_met`: true if operator condition is satisfied

---

### 5. Net Worth

Total net worth (semua wallet balance) mencapai target.

```typescript
{
  type: "net_worth",
  config: {
    operator: ">=" | ">" | "<=" | "<" | "=",
    target_amount: number,
    include_hidden_wallets: boolean
  }
}
```

**Example:**
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
- `current_value`: Sum of all wallet balances
- `target_value`: target_amount from config
- `progress_percentage`: (current / target) × 100
- `is_met`: true if operator condition is satisfied

---

### 6. Category Spending

Spending pada kategori tertentu dalam periode.

```typescript
{
  type: "category_spending",
  config: {
    category_id: string,
    operator: ">=" | ">" | "<=" | "<" | "=",
    amount: number,
    period: "month" | "quarter" | "year"
  }
}
```

**Example:**
```json
{
  "type": "category_spending",
  "config": {
    "category_id": "category-food-uuid",
    "operator": "<=",
    "amount": 3000000,
    "period": "month"
  }
}
```

**Progress Calculation:**
- `current_value`: Sum of expenses in category for period
- `target_value`: amount from config
- `progress_percentage`: 100 if met (for <= operator), else calculated
- `is_met`: true if operator condition is satisfied

---

## 🎨 Frontend Implementation Guide

### 1. Create Milestone Form

**Step 1: Select Condition Template**

```typescript
const conditionTemplates = [
  {
    value: 'wallet_balance',
    label: 'Saldo Wallet Mencapai Target',
    icon: 'wallet-outline',
    description: 'Milestone tercapai ketika saldo wallet mencapai nominal tertentu'
  },
  {
    value: 'budget_control',
    label: 'Budget Tidak Overspend',
    icon: 'shield-checkmark-outline',
    description: 'Milestone tercapai ketika budget tidak overspend selama X bulan'
  },
  {
    value: 'transaction_amount',
    label: 'Dapat Income/Expense Tertentu',
    icon: 'cash-outline',
    description: 'Milestone tercapai ketika ada 1 transaksi dengan nominal tertentu'
  },
  {
    value: 'period_total',
    label: 'Total Income/Expense Periode',
    icon: 'calendar-outline',
    description: 'Milestone tercapai ketika total transaksi dalam periode mencapai target'
  },
  {
    value: 'net_worth',
    label: 'Net Worth Target',
    icon: 'trending-up-outline',
    description: 'Milestone tercapai ketika total kekayaan mencapai target'
  },
  {
    value: 'category_spending',
    label: 'Limit Spending Kategori',
    icon: 'pricetag-outline',
    description: 'Milestone tercapai ketika spending kategori dalam batas yang ditentukan'
  }
];
```

**Step 2: Dynamic Form Based on Selected Type**

```typescript
function renderConditionForm(selectedType: string) {
  switch(selectedType) {
    case 'wallet_balance':
      return (
        <Form>
          <Select
            label="Wallet"
            options={wallets}
            allowNull={true}
            nullLabel="Semua Wallet"
          />
          <Select
            label="Operator"
            options={[
              { value: '>=', label: 'Lebih besar sama dengan (≥)' },
              { value: '>', label: 'Lebih besar (>)' },
              { value: '<=', label: 'Lebih kecil sama dengan (≤)' },
              { value: '<', label: 'Lebih kecil (<)' },
              { value: '=', label: 'Sama dengan (=)' }
            ]}
          />
          <CurrencyInput
            label="Target Amount"
            placeholder="Rp 0"
          />
        </Form>
      );

    case 'budget_control':
      return (
        <Form>
          <Select label="Budget" options={budgets} />
          <RadioGroup label="Kondisi">
            <Radio value="no_overspend" label="Tidak Overspend" />
            <Radio value="under_percentage" label="Di bawah % limit" />
          </RadioGroup>
          {/* Show percentage input if under_percentage selected */}
          {condition === 'under_percentage' && (
            <NumberInput
              label="Percentage"
              min={1}
              max={100}
              suffix="%"
            />
          )}
          <NumberInput
            label="Consecutive Months"
            min={1}
            max={12}
            defaultValue={1}
          />
        </Form>
      );

    // ... other cases
  }
}
```

### 2. Display Timeline

```typescript
interface MilestoneTimelineProps {
  milestones: Milestone[];
}

function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  // Group by status
  const grouped = {
    achieved: milestones.filter(m => m.status === 'achieved'),
    in_progress: milestones.filter(m => m.status === 'in_progress'),
    pending: milestones.filter(m => m.status === 'pending'),
    failed: milestones.filter(m => m.status === 'failed')
  };

  return (
    <Timeline>
      {milestones.map(milestone => (
        <TimelineItem
          key={milestone.id}
          status={milestone.status}
          icon={milestone.icon}
          color={milestone.color}
        >
          <MilestoneCard
            title={milestone.name}
            description={milestone.description}
            targetDate={milestone.target_date}
            achievedDate={milestone.achieved_at}
            progress={milestone.overall_progress}
            conditions={milestone.conditions}
          />
        </TimelineItem>
      ))}
    </Timeline>
  );
}
```

### 3. Progress Display

```typescript
function MilestoneProgress({ milestone }: { milestone: Milestone }) {
  return (
    <Card>
      <Header>
        <Icon name={milestone.icon} color={milestone.color} />
        <Title>{milestone.name}</Title>
        <StatusBadge status={milestone.status} />
      </Header>

      <Description>{milestone.description}</Description>

      {/* Overall Progress */}
      <ProgressBar
        value={milestone.overall_progress}
        color={milestone.color}
      />
      <ProgressText>
        {milestone.overall_progress.toFixed(2)}% Complete
      </ProgressText>

      {/* Individual Conditions */}
      <ConditionsList>
        {milestone.conditions.map(condition => (
          <ConditionItem key={condition.id}>
            <ConditionIcon
              type={condition.type}
              isMet={condition.is_met}
            />
            <ConditionInfo>
              <ConditionType>{getConditionLabel(condition.type)}</ConditionType>
              <ConditionValue>
                {formatValue(condition.current_value)} / {formatValue(condition.target_value)}
              </ConditionValue>
            </ConditionInfo>
            <ConditionProgress value={condition.progress_percentage} />
          </ConditionItem>
        ))}
      </ConditionsList>

      {/* Dates */}
      <DateInfo>
        <DateItem>
          <Label>Target Date</Label>
          <Date>{formatDate(milestone.target_date)}</Date>
        </DateItem>
        {milestone.achieved_at && (
          <DateItem>
            <Label>Achieved Date</Label>
            <Date success>{formatDate(milestone.achieved_at)}</Date>
          </DateItem>
        )}
      </DateInfo>
    </Card>
  );
}
```

### 4. Helper Functions

```typescript
// Format value based on condition type
function formatValue(value: number | boolean, type: string): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  // For currency values
  if (['wallet_balance', 'transaction_amount', 'period_total', 'net_worth', 'category_spending'].includes(type)) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  }

  // For months
  if (type === 'budget_control') {
    return `${value} month${value > 1 ? 's' : ''}`;
  }

  return String(value);
}

// Get condition label
function getConditionLabel(type: string): string {
  const labels = {
    wallet_balance: 'Wallet Balance',
    budget_control: 'Budget Control',
    transaction_amount: 'Transaction Amount',
    period_total: 'Period Total',
    net_worth: 'Net Worth',
    category_spending: 'Category Spending'
  };
  return labels[type] || type;
}

// Get status color
function getStatusColor(status: string): string {
  const colors = {
    pending: '#95a5a6',
    in_progress: '#3498db',
    achieved: '#2ecc71',
    failed: '#e74c3c',
    cancelled: '#7f8c8d'
  };
  return colors[status] || '#95a5a6';
}
```

### 5. Fetch & Refresh Data

```typescript
// Fetch all milestones
async function fetchMilestones(filters?: {
  status?: string;
  sort_by?: string;
  order?: string;
}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/milestones?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch milestones');
  return response.json();
}

// Create milestone
async function createMilestone(data: CreateMilestoneDto) {
  const response = await fetch('/milestones', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

// Refresh progress
async function refreshProgress(milestoneId: string) {
  const response = await fetch(`/milestones/${milestoneId}/check-progress`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to refresh progress');
  return response.json();
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request - Validation Error**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "name should not be empty",
    "conditions must contain at least 1 element",
    "color must be a valid hex color code (e.g., #26de81)"
  ]
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
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

### Frontend Error Handling

```typescript
try {
  const milestone = await createMilestone(data);
  toast.success('Milestone created successfully!');
  navigate(`/milestones/${milestone.id}`);
} catch (error) {
  if (error.statusCode === 400) {
    // Validation errors
    setErrors(error.errors);
  } else if (error.statusCode === 401) {
    // Unauthorized - redirect to login
    navigate('/login');
  } else {
    // Generic error
    toast.error(error.message || 'Something went wrong');
  }
}
```

---

## 📱 Mobile/React Native Example

```typescript
import { useState, useEffect } from 'react';

function MilestoneScreen() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetchMilestones({
        sort_by: 'target_date',
        order: 'ASC'
      });
      setMilestones(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <FlatList
      data={milestones}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <MilestoneCard milestone={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={<EmptyState />}
    />
  );
}
```

---

## 🔄 Real-time Updates (Optional)

Jika ingin real-time updates, bisa polling atau websocket:

**Polling Example:**
```typescript
useEffect(() => {
  // Poll every 30 seconds
  const interval = setInterval(() => {
    fetchMilestones();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

**Or use WebSocket (if implemented):**
```typescript
useEffect(() => {
  const socket = new WebSocket('ws://api.wallport.com/ws');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'milestone_updated') {
      updateMilestone(data.milestone);
    }
  };

  return () => socket.close();
}, []);
```

---

## 📝 TypeScript Types

```typescript
// Enums
enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  ACHIEVED = 'achieved',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

enum ConditionType {
  WALLET_BALANCE = 'wallet_balance',
  BUDGET_CONTROL = 'budget_control',
  TRANSACTION_AMOUNT = 'transaction_amount',
  PERIOD_TOTAL = 'period_total',
  NET_WORTH = 'net_worth',
  CATEGORY_SPENDING = 'category_spending'
}

enum Operator {
  GTE = '>=',
  GT = '>',
  LTE = '<=',
  LT = '<',
  EQ = '='
}

// Interfaces
interface Milestone {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions: ConditionWithProgress[];
  target_date: string;
  achieved_at?: string;
  status: MilestoneStatus;
  overall_progress: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ConditionWithProgress {
  id: string;
  type: ConditionType;
  config: any;
  current_value: number | boolean;
  target_value: number | boolean;
  progress_percentage: number;
  is_met: boolean;
}

interface CreateMilestoneDto {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions: ConditionDto[];
  target_date: string;
}

interface ConditionDto {
  type: ConditionType;
  config: any;
}

interface UpdateMilestoneDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions?: ConditionDto[];
  target_date?: string;
}

interface UpdateStatusDto {
  status: 'achieved' | 'failed' | 'cancelled';
}
```

---

## 🎯 Best Practices

1. **Always validate before submit**
   - Check required fields
   - Validate hex color format
   - Validate date format

2. **Handle loading states**
   - Show skeleton while loading
   - Disable form during submission
   - Show progress indicators

3. **Optimize API calls**
   - Cache milestone list
   - Only refresh when necessary
   - Use pull-to-refresh pattern

4. **User feedback**
   - Show success/error toasts
   - Validate inline (real-time)
   - Show confirmation dialogs for delete

5. **Offline support (optional)**
   - Cache milestones locally
   - Queue updates when offline
   - Sync when back online

---

## 📞 Support

Untuk pertanyaan atau issue:
- Check: `/MILESTONE-SPECS.md` untuk detail lengkap
- API Docs: Generate dengan `npm run generate:spec`
- Backend repo: Contact backend team

Happy coding! 🚀

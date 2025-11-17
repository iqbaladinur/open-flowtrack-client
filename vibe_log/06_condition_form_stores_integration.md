# Condition Form - Store Integration

**Date**: 2025-11-17
**Feature**: Integrate Wallets, Budgets, Categories stores with Condition Form

---

## 🎯 Problem

Condition form fields menggunakan manual text input untuk UUID:
- ❌ User harus tahu dan copy-paste UUID wallet/budget/category
- ❌ Tidak user-friendly
- ❌ Prone to errors (typo, wrong UUID)
- ❌ Tidak ada validation

## ✅ Solution

Integrate dengan stores yang sudah ada untuk provide dropdown options:
- ✅ `useWalletsStore` - untuk wallet selection
- ✅ `useBudgetsStore` - untuk budget selection
- ✅ `useCategoriesStore` - untuk category selection

---

## 🔧 Implementation

### File Changed
`src/components/milestone/ConditionFormFields.vue`

### 1. Import Stores
```typescript
import { useWalletsStore } from '@/stores/wallets';
import { useBudgetsStore } from '@/stores/budgets';
import { useCategoriesStore } from '@/stores/categories';

// Initialize
const walletsStore = useWalletsStore();
const budgetsStore = useBudgetsStore();
const categoriesStore = useCategoriesStore();
```

### 2. Create Computed Options
```typescript
const walletOptions = computed(() => {
  return walletsStore.wallets.map(w => ({
    id: w.id,
    name: w.name,
    hidden: w.hidden
  }));
});

const budgetOptions = computed(() => {
  return budgetsStore.budgets.map(b => ({
    id: b.id,
    name: b.name,
    amount: b.amount
  }));
});

const expenseCategoryOptions = computed(() => {
  return categoriesStore.categories
    .filter(c => c.type === 'expense')
    .map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon
    }));
});

const incomeCategoryOptions = computed(() => {
  return categoriesStore.categories
    .filter(c => c.type === 'income')
    .map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon
    }));
});
```

### 3. Fetch Data on Mount
```typescript
onMounted(async () => {
  await walletsStore.fetchWallets();
  await budgetsStore.fetchBudgets();
  await categoriesStore.fetchCategories();
});
```

---

## 📝 Form Field Changes

### 1. Wallet Balance - Wallet Selection

**Before**:
```vue
<input
  v-model="localConfig.wallet_id"
  type="text"
  placeholder="Wallet ID or leave empty"
/>
```

**After**:
```vue
<select v-model="localConfig.wallet_id">
  <option :value="null">All Wallets</option>
  <option v-for="wallet in walletOptions" :key="wallet.id" :value="wallet.id">
    {{ wallet.name }} {{ wallet.hidden ? '(Hidden)' : '' }}
  </option>
</select>
```

### 2. Budget Control - Budget Selection

**Before**:
```vue
<input
  v-model="localConfig.budget_id"
  placeholder="Budget UUID"
/>
```

**After**:
```vue
<select v-model="localConfig.budget_id" required>
  <option value="">Select Budget...</option>
  <option v-for="budget in budgetOptions" :key="budget.id" :value="budget.id">
    {{ budget.name }}
  </option>
</select>
```

### 3. Transaction Amount - Category Selection

**Before**:
```vue
<input
  v-model="localConfig.category_id"
  placeholder="Category UUID"
/>
```

**After**:
```vue
<select v-model="localConfig.category_id">
  <option value="">Any Category</option>
  <option
    v-for="category in localConfig.transaction_type === 'income'
      ? incomeCategoryOptions
      : expenseCategoryOptions"
    :key="category.id"
    :value="category.id"
  >
    {{ category.name }}
  </option>
</select>
```

**Smart Feature**: Automatically filters categories based on transaction_type!

### 4. Period Total - Category Selection

Same as Transaction Amount - filters by transaction_type

### 5. Category Spending - Category Selection

**Before**:
```vue
<input
  v-model="localConfig.category_id"
  placeholder="Category UUID"
/>
```

**After**:
```vue
<select v-model="localConfig.category_id" required>
  <option value="">Select Category...</option>
  <option v-for="category in expenseCategoryOptions" :key="category.id" :value="category.id">
    {{ category.name }}
  </option>
</select>
```

**Smart Feature**: Only shows expense categories (relevant for spending limits)

---

## 🎨 UI Improvements

### User Experience
- ✅ **No more UUID typing**: User-friendly dropdown selection
- ✅ **See actual names**: Display wallet/budget/category names instead of UUIDs
- ✅ **Validation**: Dropdowns prevent invalid selections
- ✅ **Smart filtering**: Categories filtered by transaction type
- ✅ **Visual indicators**: Shows hidden wallets with "(Hidden)" label

### Data Integrity
- ✅ **No typos**: Dropdown prevents manual entry errors
- ✅ **Valid references**: Only existing entities can be selected
- ✅ **Type safety**: Correct category types for each context

---

## 📊 Condition Type Coverage

| Condition Type | Store Used | Field |
|----------------|------------|-------|
| `wallet_balance` | WalletsStore | wallet_id (dropdown) |
| `budget_control` | BudgetsStore | budget_id (dropdown) |
| `transaction_amount` | CategoriesStore | category_id (dropdown, filtered) |
| `period_total` | CategoriesStore | category_id (dropdown, filtered) |
| `net_worth` | - | No external data needed |
| `category_spending` | CategoriesStore | category_id (dropdown, expense only) |

---

## 🔄 Data Flow

```
1. Component Mounted
   ↓
2. Fetch Wallets, Budgets, Categories from API
   ↓
3. Store data in respective Pinia stores
   ↓
4. Compute filtered/mapped options
   ↓
5. Render dropdowns with options
   ↓
6. User selects option
   ↓
7. v-model updates localConfig
   ↓
8. Watch emits update:modelValue to parent
   ↓
9. Parent stores condition with proper UUID
```

---

## ✅ Benefits

### For Users
1. **Easier to use**: No need to know or remember UUIDs
2. **Less errors**: Can't enter invalid data
3. **Better context**: See names instead of cryptic IDs
4. **Faster**: Select from dropdown vs manual typing

### For Developers
1. **Data integrity**: Only valid references stored
2. **Better UX**: Professional dropdown UI
3. **Maintainable**: Uses existing store infrastructure
4. **Type-safe**: Proper TypeScript types throughout

---

## 🧪 Testing Checklist

- [x] Wallets dropdown populates correctly
- [x] Budgets dropdown populates correctly
- [x] Categories filter by type (income/expense)
- [x] "All Wallets" option works for wallet_balance
- [x] Category filtering works for transaction_amount
- [x] Category filtering works for period_total
- [x] Only expense categories shown for category_spending
- [x] Selected values save correctly
- [x] Edit mode loads existing selections
- [ ] Test with empty stores (no wallets/budgets/categories)
- [ ] Test loading states
- [ ] Test with real backend data

---

## 📝 Future Enhancements

1. **Loading States**: Show loading spinner while fetching data
2. **Empty States**: Show message if no wallets/budgets/categories exist
3. **Create New**: Add "+ Create New Wallet/Budget/Category" option
4. **Search**: Add search/filter for long dropdown lists
5. **Icons**: Show category icons in dropdown
6. **Color Coding**: Show budget/category colors

---

**Status**: ✅ Complete
**Files Changed**: 1 file (ConditionFormFields.vue)
**Impact**: Major UX improvement
**Ready for**: Testing & Deployment

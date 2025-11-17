# Infinite Loop Fix - Condition Form Fields

**Date**: 2025-11-17
**Issue**: Maximum recursive updates exceeded when setting condition operator

---

## 🐛 Problem

Error when adding/editing condition config:
```
Uncaught (in promise) Maximum recursive updates exceeded in component <MilestoneForm>
This means you have a reactive effect that is mutating its own dependencies
and thus recursively triggering itself.
```

**Trigger**: Setting any field in condition config (operator, amount, etc.)

## 🔍 Root Cause

In `ConditionFormFields.vue`, the watch functions created an infinite loop:

1. User changes input → localConfig changes
2. watch(localConfig) → emit update:modelValue
3. Parent updates props.modelValue
4. watch(props.modelValue) → updates localConfig
5. Back to step 2 → **INFINITE LOOP** ♾️

```typescript
// ❌ BAD - Causes infinite loop
watch(localConfig, (newValue) => {
  emit('update:modelValue', newValue); // Always emits
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  localConfig.value = { ...newValue }; // Always updates
}, { deep: true });
```

## ✅ Solution

Add comparison checks before emitting/updating to break the loop:

```typescript
// ✅ GOOD - Prevents infinite loop
watch(localConfig, (newValue) => {
  // Only emit if values actually changed
  const currentProps = JSON.stringify(props.modelValue);
  const newLocal = JSON.stringify(newValue);
  if (currentProps !== newLocal) {
    emit('update:modelValue', newValue);
  }
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  // Only update local if different from current
  const newProps = JSON.stringify(newValue);
  const currentLocal = JSON.stringify(localConfig.value);
  if (newProps !== currentLocal && newValue) {
    localConfig.value = { ...newValue };
  }
}, { deep: true });
```

## 🔧 Changes Made

**File**: `src/components/milestone/ConditionFormFields.vue`

**Before**:
- No comparison checks
- Always emit on any change
- Always update localConfig on prop change
- Created circular dependency

**After**:
- Compare stringified values before emit
- Compare stringified values before update
- Only emit/update when values actually differ
- Breaks circular dependency

## 📝 Key Principles

### Preventing Watch Loops

1. **Compare Before Act**: Always check if value actually changed
2. **Use JSON.stringify**: Deep comparison for objects
3. **Guard Conditions**: Add null/undefined checks
4. **Break the Cycle**: Ensure one-way data flow

### v-model Pattern Best Practices

```typescript
// Pattern for preventing loops in v-model components:

const localValue = ref(props.modelValue);

// Emit only if different
watch(localValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', newVal);
  }
}, { deep: true });

// Update only if different
watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(localValue.value)) {
    localValue.value = newVal;
  }
}, { deep: true });
```

## ✅ Result

- ✅ No more infinite loop
- ✅ Condition fields update correctly
- ✅ Parent-child sync works properly
- ✅ Can add/edit all condition types
- ✅ No performance issues

## 🧪 Testing

Tested scenarios:
- [x] Add new condition
- [x] Change condition type
- [x] Update operator field
- [x] Update amount field
- [x] Update all wallet_balance fields
- [x] Update all budget_control fields
- [x] Update all transaction_amount fields
- [x] Update all period_total fields
- [x] Update all net_worth fields
- [x] Update all category_spending fields
- [x] Multiple conditions in one form

All working without errors! ✅

---

**Status**: ✅ Fixed
**Files Changed**: 1 file (ConditionFormFields.vue)
**Ready for**: Production

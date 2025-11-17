// ============================================================================
// Milestone Feature Type Definitions
// ============================================================================

/**
 * Milestone status enum
 */
export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  ACHIEVED = 'achieved',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Condition type enum
 */
export enum ConditionType {
  WALLET_BALANCE = 'wallet_balance',
  BUDGET_CONTROL = 'budget_control',
  TRANSACTION_AMOUNT = 'transaction_amount',
  PERIOD_TOTAL = 'period_total',
  NET_WORTH = 'net_worth',
  CATEGORY_SPENDING = 'category_spending',
}

/**
 * Comparison operator enum
 */
export enum Operator {
  GTE = '>=',
  GT = '>',
  LTE = '<=',
  LT = '<',
  EQ = '=',
}

/**
 * Period type enum
 */
export enum Period {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom',
}

/**
 * Transaction type enum
 */
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

/**
 * Budget condition type enum
 */
export enum BudgetConditionType {
  NO_OVERSPEND = 'no_overspend',
  UNDER_PERCENTAGE = 'under_percentage',
}

// ============================================================================
// Condition Config Interfaces
// ============================================================================

/**
 * Wallet Balance Condition Config
 */
export interface WalletBalanceConfig {
  wallet_id: string | null; // null = all wallets
  operator: Operator;
  target_amount: number;
}

/**
 * Budget Control Condition Config
 */
export interface BudgetControlConfig {
  budget_id: string;
  condition: BudgetConditionType;
  consecutive_months?: number; // Default: 1
  percentage?: number; // Required if condition = 'under_percentage'
}

/**
 * Transaction Amount Condition Config
 */
export interface TransactionAmountConfig {
  transaction_type: TransactionType;
  operator: Operator;
  amount: number;
  category_id?: string; // Optional
}

/**
 * Period Total Condition Config
 */
export interface PeriodTotalConfig {
  transaction_type: TransactionType;
  operator: Operator;
  amount: number;
  period: Period;
  start_date?: string; // Required if period = 'custom'
  end_date?: string; // Required if period = 'custom'
  category_id?: string; // Optional
}

/**
 * Net Worth Condition Config
 */
export interface NetWorthConfig {
  operator: Operator;
  target_amount: number;
  include_hidden_wallets: boolean;
}

/**
 * Category Spending Condition Config
 */
export interface CategorySpendingConfig {
  category_id: string;
  operator: Operator;
  amount: number;
  period: Period;
}

/**
 * Union type for all condition configs
 */
export type ConditionConfig =
  | WalletBalanceConfig
  | BudgetControlConfig
  | TransactionAmountConfig
  | PeriodTotalConfig
  | NetWorthConfig
  | CategorySpendingConfig;

// ============================================================================
// Condition Interfaces
// ============================================================================

/**
 * Base Condition DTO (for creating/updating)
 */
export interface ConditionDto {
  type: ConditionType;
  config: ConditionConfig;
}

/**
 * Condition with Progress (from API response)
 */
export interface ConditionWithProgress {
  id: string;
  type: ConditionType;
  config: ConditionConfig;
  current_value: number | boolean;
  target_value: number | boolean;
  progress_percentage: number;
  is_met: boolean;
}

// ============================================================================
// Milestone Interfaces
// ============================================================================

/**
 * Create Milestone DTO
 */
export interface CreateMilestoneDto {
  name: string; // Required, max 200 chars
  description?: string; // Optional, max 1000 chars
  icon?: string; // Optional, max 50 chars
  color?: string; // Optional, hex color
  conditions: ConditionDto[]; // Required, min 1, max 10
  target_date: string; // Required, ISO date
}

/**
 * Update Milestone DTO
 */
export interface UpdateMilestoneDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions?: ConditionDto[];
  target_date?: string;
}

/**
 * Update Status DTO
 */
export interface UpdateStatusDto {
  status: 'achieved' | 'failed' | 'cancelled';
}

/**
 * Milestone Response (from API)
 */
export interface Milestone {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  conditions: ConditionWithProgress[];
  target_date: string;
  achieved_at?: string;
  status: MilestoneStatus;
  overall_progress: number; // 0-100
  user_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * Get Milestones Query Parameters
 */
export interface GetMilestonesParams {
  status?: MilestoneStatus;
  sort_by?: 'target_date' | 'created_at' | 'name';
  order?: 'ASC' | 'DESC';
}

// ============================================================================
// UI Helper Types
// ============================================================================

/**
 * Condition Template for UI
 */
export interface ConditionTemplate {
  value: ConditionType;
  label: string;
  icon: string;
  description: string;
}

/**
 * Milestone Form State
 */
export interface MilestoneFormState {
  name: string;
  description: string;
  icon: string;
  color: string;
  target_date: string;
  conditions: ConditionDto[];
}

/**
 * Condition Form State (for dynamic form rendering)
 */
export interface ConditionFormState {
  type: ConditionType;
  config: Partial<ConditionConfig>;
}

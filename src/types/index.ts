export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  name: string;
  currency: 'USD' | 'IDR';
  balance: number;
  initial_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  is_default: boolean;
  user_id?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  wallet_id: string;
  category_id: string;
  date: string;
  note?: string;
  is_recurring: boolean;
  recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  wallet?: Wallet;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  category_id: string;
  limit_amount: number;
  spent_amount: number;
  month: number;
  year: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface SummaryReport {
  total_income: number;
  total_expense: number;
  net_income: number;
  transaction_count: number;
  start_date: string;
  end_date: string;
}

export interface CategoryReport {
  category_id: string;
  category_name: string;
  category_type: 'income' | 'expense';
  total_amount: number;
  transaction_count: number;
  percentage: number;
}

export interface WalletReport {
  wallet_id: string;
  wallet_name: string;
  total_income: number;
  total_expense: number;
  net_flow: number;
  current_balance: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export type CurrencyType = 'USD' | 'IDR';
export type TransactionType = 'income' | 'expense';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'yearly';
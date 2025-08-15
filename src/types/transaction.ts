import type { Wallet } from './wallet';
import type { Category } from './category';

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

export type TransactionType = 'income' | 'expense';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

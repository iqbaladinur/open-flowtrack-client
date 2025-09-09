import type { Wallet } from './wallet';
import type { Category } from './category';

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  wallet_id: string;
  category_id: string | null;
  destination_wallet_id?: string;
  date: string;
  note?: string;
  is_recurring: boolean;
  recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  wallet?: Wallet;
  category?: Category;
  destinationWallet?: Wallet;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

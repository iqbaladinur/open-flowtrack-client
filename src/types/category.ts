export interface Category {
  id?: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  icon: string;
  color: string;
  is_default?: boolean;
  user_id?: string;
  created_at?: string;
}

import type { Category } from './category';

export interface Budget {
  id: string;
  category_id: string;
  limit_amount: number;
  month: number;
  year: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  category: Category;
  total_spent: number;
}

import { Category } from "./category";

export interface Budget {
  id: string;
  name: string;
  category_ids: string[];
  categories: Category[];
  limit_amount: number;
  start_date: string;
  end_date: string;
  spent_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateBudgetPayload = {
  name: string;
  category_ids: string[];
  limit_amount: number;
  start_date: string;
  end_date: string;
};

export type UpdateBudgetPayload = Partial<CreateBudgetPayload>;

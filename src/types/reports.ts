export interface SummaryReport {
  total_income: number;
  total_expense: number;
  total_transfer: number;
  net_income: number;
  transaction_count: number;
  start_date: string;
  end_date: string;
}

export interface CategoryReport {
  category_id: string;
  category_name: string;
  category_type: 'income' | 'expense' | 'transfer';
  total_amount: number;
  transaction_count: number;
  percentage: number;
}

export interface WalletReport {
  wallet_id: string;
  wallet_name: string;
  total_income: number;
  total_expense: number;
  total_transfer_in: number;
  total_transfer_out: number;
  net_flow: number;
  current_balance: number;
}

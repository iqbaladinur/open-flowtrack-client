export interface Wallet {
  id: string;
  name: string;
  initial_balance: number;
  hidden: boolean;
  is_main_wallet?: boolean;
  created_at: string;
  updated_at: string;
  current_balance?: number; // This is often returned from API calls
}

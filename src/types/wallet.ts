export interface Wallet {
  id: string;
  name: string;
  icon?: string;
  initial_balance: number;
  hidden: boolean;
  is_main_wallet?: boolean;
  is_saving?: boolean;
  created_at: string;
  updated_at: string;
  current_balance?: number; // This is often returned from API calls
}

export type WalletIconType =
  | 'bri' | 'bca' | 'bni' | 'mandiri' | 'jago'
  | 'cimb' | 'permata' | 'bsi' | 'jenius' | 'seabank' | 'btn'
  | 'gopay' | 'ovo' | 'dana' | 'shopeepay' | 'linkaja'
  | 'cash' | 'wallet' | 'other';

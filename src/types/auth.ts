import type { User } from './user';
import type { Config } from './config';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  config: Config;
}

export interface ProfileResponse {
  user: User;
  config: Config;
}

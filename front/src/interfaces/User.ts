import type { Address } from "./Address";
import type { Preference } from "./Preference";

export interface User {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  role: string;
  has_confirmed_account: boolean;
  created_at: string;
  deleted_at: string | null;
  last_updated_password: string | null;
  number_connexion_attempts: number;
  blocked_until: string | null;
  addresses: Address[];
  preferences: Preference[];
}

export interface UserCountDate {
  count: number;
  date: Date;
}

export interface Stats {
  totalUsers: number;
  newUsers: UserCountDate[];
  totalRevenue: number;
  averageOrder: number;
  userConversionRate: number;
  totalUsersByNotificationType: {
    count: number;
    type: string;
  }[]
}

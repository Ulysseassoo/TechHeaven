import type { Alert } from "./Alert";

export interface Preference {
  id: string;
  alert_id: string;
  user_id: string;
  isEnabled: boolean;
  alert: Alert;
}

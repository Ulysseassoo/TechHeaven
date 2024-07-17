export interface Preference {
  id: string;
  alert_id: string;
  user_id: string;
  isEnabled: boolean;
  alert: Alert;
}

interface Alert {
  id: string;
  name: string;
  param: string | null;
  type: AlertTypes;
}

export enum AlertTypes {
  NEWSLETTER = "NEWSLETTER",
}

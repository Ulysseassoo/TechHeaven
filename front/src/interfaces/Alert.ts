export interface Alert {
  id: string;
  name: string;
  param: string | null;
  type: AlertTypes;
}

export enum AlertTypes {
  NEWSLETTER = "NEWSLETTER",
  PRODUCT = "PRODUCT",
  NONE = ""
}

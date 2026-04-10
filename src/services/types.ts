export interface ApiResponse<T = any> {
  status: "SUCCESS" | "ERROR" | "INVALID" | string;
  data?: T[];
  message?: string;
  errors?: Array<{ errCode: string; [key: string]: any }>;
  serverError?: boolean;
}

export interface OrderItem {
  id: string;
  orderCode: string;
  name: string;
  drink: string;
  size: string;
  note: string;
  [key: string]: any;
}

export interface Order {
  id?: string;
  orderCode?: string;
  status?: string;
  title?: string;
  drinkLink?: string;
  menuCode?: string;
  redirect?: boolean;
  redirectLink?: string;
  [key: string]: any;
}

export interface MenuItem {
  id: string;
  name?: string;
  [key: string]: any;
}

export interface Menu {
  code?: string;
  name?: string;
  [key: string]: any;
}

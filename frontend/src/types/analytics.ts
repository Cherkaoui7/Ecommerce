export interface GtagEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface PurchaseItem {
  item_id: number;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ViewItemData {
  id: number;
  name: string;
  price: number;
  category?: string;
}

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

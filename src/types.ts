export interface Competitor {
  seller: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  sku: string;
  name: string;
  myPrice: number;
  minPrice: number;
  maxPrice: number;
  step: number;
  competitors: Competitor[];
}

export type Reason = "UNDERCUT" | "AT_MIN" | "AT_MAX" | "NO_COMPETITORS";

export interface PriceResult {
  sku: string;
  oldPrice: number;
  newPrice: number;
  reason: Reason;
}

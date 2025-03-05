export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    discountCode?: string;
    discountAmount: number;
    finalAmount: number;
    date: Date;
  }
  
  export interface DiscountCode {
    code: string;
    percentage: number;
    used: boolean;
  }
  
  export interface AdminStats {
    totalItemsPurchased: number;
    totalPurchaseAmount: number;
    discountCodes: DiscountCode[];
    totalDiscountAmount: number;
  }
import { v4 as uuidv4 } from 'uuid';
import { Product, CartItem, Order, DiscountCode, AdminStats } from '../types';

// In-memory store
let products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'Premium wireless headphones with noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with health tracking',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 79.99,
    description: 'Portable Bluetooth speaker with deep bass',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '4',
    name: 'Laptop Backpack',
    price: 49.99,
    description: 'Durable laptop backpack with multiple compartments',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '5',
    name: 'Wireless Charger',
    price: 29.99,
    description: 'Fast wireless charger for smartphones',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
];

let cart: CartItem[] = [];
let orders: Order[] = [];
let discountCodes: DiscountCode[] = [];

// Configuration
const NTH_ORDER_FOR_DISCOUNT = 3; // Every 3rd order gets a discount
const DISCOUNT_PERCENTAGE = 10; // 10% discount

/**
 * Get all products
 */
export const getProducts = (): Promise<Product[]> => {
  return Promise.resolve(products);
};

/**
 * Get a product by ID
 */
export const getProductById = (id: string): Promise<Product | undefined> => {
  const product = products.find(p => p.id === id);
  return Promise.resolve(product);
};

/**
 * Get current cart
 */
export const getCart = (): Promise<CartItem[]> => {
  return Promise.resolve(cart);
};

/**
 * Add item to cart
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<CartItem[]> => {
  const product = await getProductById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  const existingItemIndex = cart.findIndex(item => item.product.id === productId);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item already in cart
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({
      product,
      quantity
    });
  }
  
  return cart;
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = (productId: string, quantity: number): Promise<CartItem[]> => {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    cart = cart.filter(item => item.product.id !== productId);
  } else {
    // Update quantity
    cart[itemIndex].quantity = quantity;
  }
  
  return Promise.resolve(cart);
};

/**
 * Remove item from cart
 */
export const removeFromCart = (productId: string): Promise<CartItem[]> => {
  cart = cart.filter(item => item.product.id !== productId);
  return Promise.resolve(cart);
};

/**
 * Clear cart
 */
export const clearCart = (): Promise<CartItem[]> => {
  cart = [];
  return Promise.resolve(cart);
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (items: CartItem[], discountCode?: string): {
  subtotal: number;
  discountAmount: number;
  total: number;
} => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  let discountAmount = 0;
  
  if (discountCode) {
    const discount = discountCodes.find(d => d.code === discountCode && !d.used);
    if (discount) {
      discountAmount = subtotal * (discount.percentage / 100);
    }
  }
  
  const total = subtotal - discountAmount;
  
  return {
    subtotal,
    discountAmount,
    total
  };
};

/**
 * Validate discount code
 */
export const validateDiscountCode = (code: string): Promise<boolean> => {
  const discount = discountCodes.find(d => d.code === code);
  return Promise.resolve(!!discount && !discount.used);
};

/**
 * Generate a new discount code
 * This is called internally when the nth order condition is met
 */
export const generateDiscountCode = (): DiscountCode => {
  const code = `DISCOUNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const discountCode: DiscountCode = {
    code,
    percentage: DISCOUNT_PERCENTAGE,
    used: false
  };
  
  discountCodes.push(discountCode);
  
  return discountCode;
};

/**
 * Checkout process
 */
export const checkout = async (discountCode?: string): Promise<Order> => {
  if (cart.length === 0) {
    throw new Error('Cart is empty');
  }
  
  // Validate discount code if provided
  let validDiscount = false;
  if (discountCode) {
    validDiscount = await validateDiscountCode(discountCode);
    if (!validDiscount) {
      throw new Error('Invalid discount code');
    }
  }
  
  // Calculate totals
  const { subtotal, discountAmount, total } = calculateCartTotals(cart, discountCode);
  
  // Create order
  const order: Order = {
    id: uuidv4(),
    items: [...cart],
    totalAmount: subtotal,
    discountCode: validDiscount ? discountCode : undefined,
    discountAmount,
    finalAmount: total,
    date: new Date()
  };
  
  // Mark discount code as used if applied
  if (validDiscount && discountCode) {
    const discountIndex = discountCodes.findIndex(d => d.code === discountCode);
    if (discountIndex !== -1) {
      discountCodes[discountIndex].used = true;
    }
  }
  
  // Add order to history
  orders.push(order);
  
  // Check if we need to generate a new discount code
  if (orders.length % NTH_ORDER_FOR_DISCOUNT === 0) {
    generateDiscountCode();
  }
  
  // Clear cart after successful checkout
  await clearCart();
  
  return order;
};

/**
 * Admin API: Get admin statistics
 */
export const getAdminStats = (): Promise<AdminStats> => {
  const totalItemsPurchased = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  
  const totalPurchaseAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  const totalDiscountAmount = orders.reduce((sum, order) => sum + order.discountAmount, 0);
  
  return Promise.resolve({
    totalItemsPurchased,
    totalPurchaseAmount,
    discountCodes,
    totalDiscountAmount
  });
};

/**
 * Admin API: Force generate a discount code
 */
export const adminGenerateDiscountCode = (): Promise<DiscountCode> => {
  const discountCode = generateDiscountCode();
  return Promise.resolve(discountCode);
};

/**
 * Get all orders (for testing/admin purposes)
 */
export const getAllOrders = (): Promise<Order[]> => {
  return Promise.resolve(orders);
};
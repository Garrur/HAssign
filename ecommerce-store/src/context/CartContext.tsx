import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { 
  getCart, 
  addToCart as apiAddToCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart,
  calculateCartTotals,
  validateDiscountCode,
  checkout as apiCheckout
} from '../services/api';

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  isDiscountValid: boolean | null;
  subtotal: number;
  discountAmount: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  emptyCart: () => Promise<void>;
  checkout: () => Promise<string>;
  validateDiscount: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [isDiscountValid, setIsDiscountValid] = useState<boolean | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await getCart();
        setCart(cartData);
        updateTotals(cartData, discountCode);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Update totals whenever cart or discount code changes
  const updateTotals = (currentCart: CartItem[], code?: string) => {
    const { subtotal, discountAmount, total } = calculateCartTotals(currentCart, code);
    setSubtotal(subtotal);
    setDiscountAmount(discountAmount);
    setTotal(total);
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      const updatedCart = await apiAddToCart(productId, quantity);
      setCart(updatedCart);
      updateTotals(updatedCart, isDiscountValid ? discountCode : undefined);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await updateCartItemQuantity(productId, quantity);
      setCart(updatedCart);
      updateTotals(updatedCart, isDiscountValid ? discountCode : undefined);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      setLoading(true);
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
      updateTotals(updatedCart, isDiscountValid ? discountCode : undefined);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Empty cart
  const emptyCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCart([]);
      setDiscountCode('');
      setIsDiscountValid(null);
      updateTotals([], undefined);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validate discount code
  const validateDiscount = async () => {
    if (!discountCode) {
      setIsDiscountValid(null);
      updateTotals(cart, undefined);
      return false;
    }

    try {
      const isValid = await validateDiscountCode(discountCode);
      setIsDiscountValid(isValid);
      updateTotals(cart, isValid ? discountCode : undefined);
      return isValid;
    } catch (error) {
      console.error('Failed to validate discount code:', error);
      setIsDiscountValid(false);
      updateTotals(cart, undefined);
      return false;
    }
  };

  // Checkout
  const checkout = async () => {
    try {
      setLoading(true);
      const order = await apiCheckout(isDiscountValid ? discountCode : undefined);
      setCart([]);
      setDiscountCode('');
      setIsDiscountValid(null);
      updateTotals([], undefined);
      return order.id;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        discountCode,
        setDiscountCode,
        isDiscountValid,
        subtotal,
        discountAmount,
        total,
        addToCart,
        updateQuantity,
        removeItem,
        emptyCart,
        checkout,
        validateDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
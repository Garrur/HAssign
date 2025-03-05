import React from 'react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-16 h-16 object-cover rounded"
      />
      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">₹{product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <button 
          onClick={handleDecrement}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus size={16} />
        </button>
        <span className="mx-2 w-8 text-center">{quantity}</span>
        <button 
          onClick={handleIncrement}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="ml-4 text-right">
        <p className="text-sm font-medium text-gray-900">
        ₹{(product.price * quantity).toFixed(2)}
        </p>
        <button 
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
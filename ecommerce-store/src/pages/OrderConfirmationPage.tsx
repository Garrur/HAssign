import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllOrders } from '../services/api';
import { Order } from '../types';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          throw new Error('Order ID is missing');
        }
        
        const orders = await getAllOrders();
        const foundOrder = orders.find(o => o.id === orderId);
        
        if (!foundOrder) {
          throw new Error('Order not found');
        }
        
        setOrder(foundOrder);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-medium text-red-600">Error</h2>
        <p className="mt-1 text-sm text-gray-500">{error || 'Order information could not be loaded'}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-gray-500">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <div className="flex">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
            </div>
            
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <p className="text-sm">Discount {order.discountCode && `(${order.discountCode})`}</p>
                <p className="text-sm font-medium">-₹{order.discountAmount.toFixed(2)}</p>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-medium text-gray-900">₹{order.finalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';

interface CartProps {
  cartItems: CartItem[];
  paymentMethods: PaymentMethod[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (paymentMethodId: string) => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  paymentMethods,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const enabledPaymentMethods = paymentMethods.filter(method => method.enabled);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Cart Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart size={24} className="text-purple-600" />
              <h2 className="text-xl font-semibold">Carrito ({cartItems.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.selectedColor} • {item.selectedSize}
                      </p>
                      <p className="text-purple-600 font-semibold">
                        ${item.product.price}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Métodos de Pago</h3>
                {enabledPaymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => onCheckout(method.id)}
                    className="w-full p-4 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                  >
                    <div className="font-medium text-gray-800">{method.name}</div>
                    {method.type === 'brubank' && method.alias && (
                      <div className="text-sm text-gray-600">Alias: {method.alias}</div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
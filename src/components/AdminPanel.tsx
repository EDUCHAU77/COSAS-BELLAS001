import React, { useState } from 'react';
import { Package, DollarSign, BarChart3, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Product, PaymentMethod } from '../types';

interface AdminPanelProps {
  products: Product[];
  paymentMethods: PaymentMethod[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Omit<Product, 'id'>) => void;
  onProductDelete: (productId: string) => void;
  onPaymentMethodUpdate: (method: PaymentMethod) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  paymentMethods,
  onProductUpdate,
  onProductAdd,
  onProductDelete,
  onPaymentMethodUpdate
}) => {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const tabs = [
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'payments', label: 'Pagos', icon: DollarSign },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const handleProductSave = (productData: Partial<Product>) => {
    if (editingProduct) {
      onProductUpdate({ ...editingProduct, ...productData });
      setEditingProduct(null);
    } else {
      onProductAdd({
        ...productData,
        id: '',
        rating: 0,
        reviews: []
      } as Omit<Product, 'id'>);
      setShowAddProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del admin */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar de navegación */}
          <nav className="w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Contenido principal */}
          <div className="flex-1">
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Agregar Producto</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded-md object-cover mr-3"
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category} / {product.subcategory}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-800'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => onProductDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Métodos de Pago</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-white rounded-lg p-6 shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{method.name}</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={method.enabled}
                            onChange={(e) => onPaymentMethodUpdate({
                              ...method,
                              enabled: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      {method.type === 'mercadopago' && (
                        <input
                          type="text"
                          placeholder="Link de Mercado Pago"
                          value={method.link || ''}
                          onChange={(e) => onPaymentMethodUpdate({
                            ...method,
                            link: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      )}
                      
                      {method.type === 'brubank' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="CBU"
                            value={method.cbu || ''}
                            onChange={(e) => onPaymentMethodUpdate({
                              ...method,
                              cbu: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder="Alias"
                            value={method.alias || ''}
                            onChange={(e) => onPaymentMethodUpdate({
                              ...method,
                              alias: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      )}
                      
                      {method.type === 'naranja' && (
                        <input
                          type="text"
                          placeholder="Link de Naranja X"
                          value={method.link || ''}
                          onChange={(e) => onPaymentMethodUpdate({
                            ...method,
                            link: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Ventas Hoy</h3>
                    <p className="text-3xl font-bold text-green-600">$2,847</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Productos Vendidos</h3>
                    <p className="text-3xl font-bold text-blue-600">47</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Visitantes</h3>
                    <p className="text-3xl font-bold text-purple-600">1,239</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
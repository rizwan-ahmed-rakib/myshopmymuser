// components/sales/SalesTab.jsx (Direct Selling)
import React, { useState } from 'react';

const SalesTab = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);

  // Sample products
  const products = [
    { id: 1, name: 'Apple iPhone 14', price: 120000, category: 'electronics', stock: 15 },
    { id: 2, name: 'Samsung Galaxy S23', price: 90000, category: 'electronics', stock: 20 },
    { id: 3, name: 'Dell Laptop', price: 75000, category: 'electronics', stock: 8 },
    { id: 4, name: 'Sony Headphones', price: 12000, category: 'accessories', stock: 25 },
  ];

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-green-600 font-bold">৳{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full mt-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Current Sale</h2>
          
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">৳{item.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <p className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {cartItems.length > 0 && (
            <>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>৳{getTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                  Complete Sale
                </button>
                <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors">
                  Create Invoice
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesTab;
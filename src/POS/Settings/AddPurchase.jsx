// components/purchase/AddPurchase.jsx
import React, { useState } from 'react';

const AddPurchase = () => {
  const [purchaseData, setPurchaseData] = useState({
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    paymentStatus: 'Due',
    status: 'Pending'
  });

  const [cartItems, setCartItems] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product: '',
    quantity: 1,
    cost: '',
    total: 0
  });

  const suppliers = [
    { id: 1, name: 'ABC Electronics', contact: '0123456789' },
    { id: 2, name: 'XYZ Suppliers', contact: '0123456790' },
    { id: 3, name: 'Tech World Ltd', contact: '0123456791' },
  ];

  const products = [
    { id: 1, name: 'iPhone 14', cost: 100000 },
    { id: 2, name: 'Samsung Galaxy', cost: 80000 },
    { id: 3, name: 'Dell Laptop', cost: 60000 },
    { id: 4, name: 'Sony Headphones', cost: 8000 },
    { id: 5, name: 'MacBook Pro', cost: 150000 },
  ];

  const addToCart = () => {
    if (newProduct.product && newProduct.quantity && newProduct.cost) {
      const product = products.find(p => p.name === newProduct.product);
      const total = newProduct.quantity * parseFloat(newProduct.cost);
      
      setCartItems([...cartItems, {
        id: Date.now(),
        name: newProduct.product,
        quantity: parseInt(newProduct.quantity),
        cost: parseFloat(newProduct.cost),
        total: total
      }]);

      setNewProduct({ product: '', quantity: 1, cost: '', total: 0 });
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getGrandTotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  const handleSubmit = () => {
    if (!purchaseData.supplier || cartItems.length === 0) {
      alert('Please fill all required fields and add products');
      return;
    }

    // Here you would typically send data to backend
    alert('Purchase order created successfully!');
    setPurchaseData({ supplier: '', date: new Date().toISOString().split('T')[0], paymentStatus: 'Due', status: 'Pending' });
    setCartItems([]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Purchase</h1>
        <p className="text-gray-600">Create new purchase order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Purchase Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Supplier & Basic Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Purchase Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={purchaseData.supplier}
                  onChange={(e) => setPurchaseData({...purchaseData, supplier: e.target.value})}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={purchaseData.date}
                  onChange={(e) => setPurchaseData({...purchaseData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={purchaseData.paymentStatus}
                  onChange={(e) => setPurchaseData({...purchaseData, paymentStatus: e.target.value})}
                >
                  <option value="Due">Due</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={purchaseData.status}
                  onChange={(e) => setPurchaseData({...purchaseData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Products */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.product}
                  onChange={(e) => {
                    const selectedProduct = products.find(p => p.name === e.target.value);
                    setNewProduct({
                      ...newProduct,
                      product: e.target.value,
                      cost: selectedProduct ? selectedProduct.cost : ''
                    });
                  }}
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>{product.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={addToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add to List
            </button>
          </div>

          {/* Products List */}
          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Products List</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Product</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Quantity</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Cost</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">৳{item.cost.toLocaleString()}</td>
                        <td className="px-4 py-2 font-semibold">৳{item.total.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">৳{getGrandTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">৳0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold">৳0</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-bold text-gray-800">Grand Total:</span>
                <span className="text-lg font-bold text-green-600">৳{getGrandTotal().toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Create Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchase;
// // components/purchase/PurchaseList.jsx
// import React, { useState } from 'react';

// const PurchaseList = () => {
//   const [purchases, setPurchases] = useState([
//     { 
//       id: 'PUR-001', 
//       supplier: 'ABC Electronics', 
//       products: ['iPhone 14', 'Samsung Galaxy'], 
//       total: 210000, 
//       date: '2024-01-15', 
//       status: 'Completed',
//       payment: 'Paid'
//     },
//     { 
//       id: 'PUR-002', 
//       supplier: 'XYZ Suppliers', 
//       products: ['Dell Laptop', 'Sony Headphones'], 
//       total: 135000, 
//       date: '2024-01-14', 
//       status: 'Pending',
//       payment: 'Due'
//     },
//     { 
//       id: 'PUR-003', 
//       supplier: 'Tech World Ltd', 
//       products: ['MacBook Pro', 'iPad Air'], 
//       total: 330000, 
//       date: '2024-01-13', 
//       status: 'Completed',
//       payment: 'Paid'
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   const filteredPurchases = purchases.filter(purchase => {
//     const matchesSearch = purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed': return 'bg-green-100 text-green-800';
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       case 'Cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPaymentColor = (payment) => {
//     return payment === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Purchase List</h1>
//         <p className="text-gray-600">View and manage all purchase orders</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Search by ID or supplier..."
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="all">All Status</option>
//           <option value="Completed">Completed</option>
//           <option value="Pending">Pending</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//         <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
//           Export
//         </button>
//       </div>

//       {/* Purchases Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-50 border-b">
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Purchase ID</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Products</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Amount</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPurchases.map(purchase => (
//               <tr key={purchase.id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-3">
//                   <div className="font-semibold text-blue-600">{purchase.id}</div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="font-medium text-gray-800">{purchase.supplier}</div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="text-sm text-gray-600">
//                     {purchase.products.slice(0, 2).join(', ')}
//                     {purchase.products.length > 2 && ` +${purchase.products.length - 2} more`}
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 font-semibold text-gray-800">
//                   ৳{purchase.total.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-gray-600">{purchase.date}</td>
//                 <td className="px-4 py-3">
//                   <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(purchase.status)}`}>
//                     {purchase.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">
//                   <span className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(purchase.payment)}`}>
//                     {purchase.payment}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex space-x-2">
//                     <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
//                     <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
//                     <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {filteredPurchases.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No purchases found matching your search.
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseList;













// components/purchase/PurchaseList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://pos.myshopmym.com/api/purchase/purchases/";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // View modal
  const [viewItem, setViewItem] = useState(null);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal
  const [editItem, setEditItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_URL);
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Purchase list লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}${deleteId}/`);
      setDeleteId(null);
      fetchPurchases();
    } catch (err) {
      alert("Purchase delete করতে সমস্যা হয়েছে।");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editItem) return;
    setEditLoading(true);
    setEditError('');
    try {
      await axios.patch(`${API_URL}${editItem.id}/`, {
        payment_status: editItem.payment_status,
        status: editItem.status,
      });
      setEditItem(null);
      fetchPurchases();
    } catch (err) {
      const errData = err.response?.data;
      if (errData && typeof errData === 'object') {
        setEditError(Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | '));
      } else {
        setEditError("Update করতে সমস্যা হয়েছে।");
      }
    } finally {
      setEditLoading(false);
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['ID', 'Supplier', 'Total', 'Date', 'Status', 'Payment'];
    const rows = filteredPurchases.map(p => [
      p.id,
      p.supplier_name || p.supplier,
      p.grand_total || p.total || 0,
      p.date,
      p.status,
      p.payment_status || p.payment
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPurchases = purchases.filter(purchase => {
    const supplierName = purchase.supplier_name || purchase.supplier || '';
    const purchaseId = String(purchase.id || '');
    const matchesSearch =
      purchaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (payment) => {
    return (payment === 'Paid') ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase List</h1>
        <p className="text-gray-600">View and manage all purchase orders</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
          <button onClick={fetchPurchases} className="ml-3 underline text-sm">আবার চেষ্টা করুন</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by ID or supplier..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Purchase ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    কোনো purchase পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(purchase => (
                  <tr key={purchase.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-blue-600">#{purchase.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {purchase.supplier_name || purchase.supplier}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      ৳{parseFloat(purchase.grand_total || purchase.total || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{purchase.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(purchase.payment_status || purchase.payment)}`}>
                        {purchase.payment_status || purchase.payment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewItem(purchase)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditItem({ ...purchase })}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(purchase.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase #{viewItem.id}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Supplier</span><span className="font-medium">{viewItem.supplier_name || viewItem.supplier}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{viewItem.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Grand Total</span><span className="font-semibold text-green-600">৳{parseFloat(viewItem.grand_total || viewItem.total || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span>{viewItem.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span>{viewItem.payment_status || viewItem.payment}</span></div>
              {viewItem.items && viewItem.items.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Items:</p>
                  {viewItem.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-600">
                      <span>{item.product_name || item.product}</span>
                      <span>x{item.quantity} @ ৳{item.cost_price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setViewItem(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Purchase?</h3>
            <p className="text-gray-600 mb-6">এই purchase order টি মুছে ফেলবেন? এটি আর ফেরত আনা যাবে না।</p>
            <div className="flex space-x-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Purchase #{editItem.id}</h3>
            {editError && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">{editError}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editItem.status}
                  onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editItem.payment_status || editItem.payment}
                  onChange={(e) => setEditItem({ ...editItem, payment_status: e.target.value })}
                >
                  <option value="Due">Due</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => { setEditItem(null); setEditError(''); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEditSubmit} disabled={editLoading} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
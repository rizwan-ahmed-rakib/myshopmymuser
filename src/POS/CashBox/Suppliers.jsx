// // components/purchase/Suppliers.jsx
// import React, { useState } from 'react';

// const Suppliers = () => {
//   const [suppliers, setSuppliers] = useState([
//     { 
//       id: 1, 
//       name: 'ABC Electronics', 
//       email: 'abc@email.com', 
//       phone: '0123456789', 
//       address: '123 Main Street, Dhaka',
//       balance: 150000,
//       status: 'Active'
//     },
//     { 
//       id: 2, 
//       name: 'XYZ Suppliers', 
//       email: 'xyz@email.com', 
//       phone: '0123456790', 
//       address: '456 Commercial Area, Chittagong',
//       balance: 75000,
//       status: 'Active'
//     },
//     { 
//       id: 3, 
//       name: 'Tech World Ltd', 
//       email: 'tech@email.com', 
//       phone: '0123456791', 
//       address: '789 Tech Zone, Sylhet',
//       balance: 0,
//       status: 'Inactive'
//     },
//   ]);

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newSupplier, setNewSupplier] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     status: 'Active'
//   });

//   const handleAddSupplier = () => {
//     if (newSupplier.name && newSupplier.phone) {
//       const supplier = {
//         id: suppliers.length + 1,
//         ...newSupplier,
//         balance: 0
//       };
//       setSuppliers([...suppliers, supplier]);
//       setNewSupplier({ name: '', email: '', phone: '', address: '', status: 'Active' });
//       setShowAddForm(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
//           <p className="text-gray-600">Manage your suppliers and vendors</p>
//         </div>
//         <button 
//           onClick={() => setShowAddForm(true)}
//           className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           + Add Supplier
//         </button>
//       </div>

//       {/* Add Supplier Form */}
//       {showAddForm && (
//         <div className="bg-gray-50 p-6 rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-4">Add New Supplier</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Supplier Name"
//               className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={newSupplier.name}
//               onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={newSupplier.email}
//               onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
//             />
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={newSupplier.phone}
//               onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
//             />
//             <select
//               className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={newSupplier.status}
//               onChange={(e) => setNewSupplier({...newSupplier, status: e.target.value})}
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//             <input
//               type="text"
//               placeholder="Address"
//               className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
//               value={newSupplier.address}
//               onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button 
//               onClick={handleAddSupplier}
//               className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
//             >
//               Save Supplier
//             </button>
//             <button 
//               onClick={() => setShowAddForm(false)}
//               className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Suppliers Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-50 border-b">
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier Name</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Contact Info</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Balance</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
//               <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {suppliers.map(supplier => (
//               <tr key={supplier.id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-3">
//                   <div className="font-semibold text-gray-800">{supplier.name}</div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="text-sm">
//                     <div className="text-gray-600">{supplier.email}</div>
//                     <div className="text-gray-500">{supplier.phone}</div>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-600">{supplier.address}</td>
//                 <td className="px-4 py-3">
//                   <span className={`font-semibold ${
//                     supplier.balance > 0 ? 'text-red-600' : 'text-green-600'
//                   }`}>
//                     ৳{supplier.balance.toLocaleString()}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">
//                   <span className={`px-3 py-1 rounded-full text-sm ${
//                     supplier.status === 'Active' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {supplier.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex space-x-2">
//                     <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
//                     <button className="text-green-600 hover:text-green-800 text-sm">View</button>
//                     <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Suppliers;









// components/purchase/Suppliers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://pos.myshopmym.com/api/purchase/suppliers/";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    name: '', email: '', phone: '', address: '', status: 'Active'
  });

  // Edit modal
  const [editItem, setEditItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_URL);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Supplier লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.phone) {
      setAddError("নাম এবং ফোন নম্বর আবশ্যক।");
      return;
    }

    setAddLoading(true);
    setAddError('');
    try {
      await axios.post(API_URL, newSupplier);
      setNewSupplier({ name: '', email: '', phone: '', address: '', status: 'Active' });
      setShowAddForm(false);
      fetchSuppliers();
    } catch (err) {
      const errData = err.response?.data;
      if (errData && typeof errData === 'object') {
        setAddError(Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | '));
      } else {
        setAddError("Supplier add করতে সমস্যা হয়েছে।");
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editItem) return;
    setEditLoading(true);
    setEditError('');
    try {
      await axios.patch(`${API_URL}${editItem.id}/`, {
        name: editItem.name,
        email: editItem.email,
        phone: editItem.phone,
        address: editItem.address,
        status: editItem.status,
      });
      setEditItem(null);
      fetchSuppliers();
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

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}${deleteId}/`);
      setDeleteId(null);
      fetchSuppliers();
    } catch (err) {
      alert("Supplier delete করতে সমস্যা হয়েছে।");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-600">Manage your suppliers and vendors</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setAddError(''); }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Supplier
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
          <button onClick={fetchSuppliers} className="ml-3 underline text-sm">আবার চেষ্টা করুন</button>
        </div>
      )}

      {/* Add Supplier Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h2 className="text-lg font-semibold mb-4">Add New Supplier</h2>
          {addError && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">{addError}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Supplier Name *"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.status}
              onChange={(e) => setNewSupplier({ ...newSupplier, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              value={newSupplier.address}
              onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddSupplier}
              disabled={addLoading}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {addLoading ? 'Saving...' : 'Save Supplier'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setAddError(''); }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Contact Info</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Balance</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">কোনো supplier নেই।</td>
                </tr>
              ) : (
                suppliers.map(supplier => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{supplier.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="text-gray-600">{supplier.email || '-'}</div>
                        <div className="text-gray-500">{supplier.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{supplier.address || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${parseFloat(supplier.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ৳{parseFloat(supplier.balance || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditItem({ ...supplier })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(supplier.id)}
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Supplier?</h3>
            <p className="text-gray-600 mb-6">এই supplier মুছে ফেলবেন? সম্পর্কিত purchase data-তে সমস্যা হতে পারে।</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Supplier</h3>
            {editError && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">{editError}</div>}
            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Name *" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
              <input type="email" placeholder="Email" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editItem.email || ''} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} />
              <input type="tel" placeholder="Phone *" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editItem.phone} onChange={(e) => setEditItem({ ...editItem, phone: e.target.value })} />
              <input type="text" placeholder="Address" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editItem.address || ''} onChange={(e) => setEditItem({ ...editItem, address: e.target.value })} />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editItem.status} onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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

export default Suppliers;
// // components/cashbox/IncomeList.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const IncomeList = () => {
//   const [incomes, setIncomes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);

//   const API_URL = "https://pos.myshopmym.com/api/cashbox/income/";

//   useEffect(() => {
//     fetchIncomes();
//   }, []);

//   const fetchIncomes = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(API_URL);
//       setIncomes(response.data);
      
//       // Calculate total
//       const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
//       setTotal(totalAmount);
//     } catch (error) {
//       console.error("Error fetching incomes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB');
//   };

//   const deleteIncome = async (id) => {
//     if (window.confirm("Are you sure you want to delete this income?")) {
//       try {
//         await axios.delete(`${API_URL}${id}/`);
//         alert("Income deleted successfully!");
//         fetchIncomes(); // Refresh list
//       } catch (error) {
//         alert("Error deleting income");
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Income Records</h1>
//           <p className="text-gray-600">All income transactions</p>
//         </div>
//         <div className="bg-green-50 px-4 py-2 rounded-lg">
//           <p className="text-sm text-gray-600">Total Income</p>
//           <p className="text-xl font-bold text-green-600">৳{total.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Income Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     <p className="mt-2 text-gray-600">Loading incomes...</p>
//                   </td>
//                 </tr>
//               ) : incomes.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No income records found
//                   </td>
//                 </tr>
//               ) : (
//                 incomes.map((income) => (
//                   <tr key={income.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-sm font-medium text-gray-900">#{income.id}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{income.title}</div>
//                       <div className="text-xs text-gray-500">
//                         Invoice ID: {income.object_id}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
//                         ৳{parseFloat(income.amount).toLocaleString()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(income.created_at)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-500">
//                         {income.description || '-'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <button
//                         onClick={() => deleteIncome(income.id)}
//                         className="text-red-600 hover:text-red-900 font-medium"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncomeList;




















// components/cashbox/IncomeList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL_of_POS from "../../posConfig";

const DEFAULT_URL = `${BASE_URL_of_POS}/api/cashbox/income/`;

const IncomeList = ({ endpoints }) => {
  const API_URL = endpoints?.income || DEFAULT_URL;

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal state
  const [editItem, setEditItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_URL);
      setIncomes(response.data);
      const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError("Income লোড করতে সমস্যা হয়েছে।");
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
      fetchIncomes();
    } catch (err) {
      alert("Income delete করতে সমস্যা হয়েছে।");
      console.error(err);
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
        title: editItem.title,
        amount: parseFloat(editItem.amount),
        description: editItem.description || null,
      });
      setEditItem(null);
      fetchIncomes();
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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income Records</h1>
          <p className="text-gray-600">All income transactions</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-xl font-bold text-green-600">৳{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
          <button onClick={fetchIncomes} className="ml-3 underline text-sm">আবার চেষ্টা করুন</button>
        </div>
      )}

      {/* Income Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading incomes...</p>
                  </td>
                </tr>
              ) : incomes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No income records found</td>
                </tr>
              ) : (
                incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{income.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{income.title}</div>
                      {income.object_id && (
                        <div className="text-xs text-gray-500">Invoice ID: {income.object_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                        ৳{parseFloat(income.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(income.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{income.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setEditItem({ ...income })}
                        className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(income.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Income?</h3>
            <p className="text-gray-600 mb-6">এই income record টি মুছে ফেলবেন? এটি আর ফেরত আনা যাবে না।</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Income</h3>

            {editError && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">{editError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editItem.amount}
                  onChange={(e) => setEditItem({ ...editItem, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editItem.description || ''}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => { setEditItem(null); setEditError(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
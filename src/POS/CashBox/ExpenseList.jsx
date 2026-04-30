// // components/cashbox/ExpenseList.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ExpenseList = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);

//   const API_URL = "https://pos.myshopmym.com/api/cashbox/expenses/";

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(API_URL);
//       setExpenses(response.data);
      
//       // Calculate total
//       const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
//       setTotal(totalAmount);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB');
//   };

//   const deleteExpense = async (id) => {
//     if (window.confirm("Are you sure you want to delete this expense?")) {
//       try {
//         await axios.delete(`${API_URL}${id}/`);
//         alert("Expense deleted successfully!");
//         fetchExpenses(); // Refresh list
//       } catch (error) {
//         alert("Error deleting expense");
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Expense Records</h1>
//           <p className="text-gray-600">All expense transactions</p>
//         </div>
//         <div className="bg-red-50 px-4 py-2 rounded-lg">
//           <p className="text-sm text-gray-600">Total Expense</p>
//           <p className="text-xl font-bold text-red-600">৳{total.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Expense Table */}
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
//                     <p className="mt-2 text-gray-600">Loading expenses...</p>
//                   </td>
//                 </tr>
//               ) : expenses.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No expense records found
//                   </td>
//                 </tr>
//               ) : (
//                 expenses.map((expense) => (
//                   <tr key={expense.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-sm font-medium text-gray-900">#{expense.id}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{expense.title}</div>
//                       <div className="text-xs text-gray-500">
//                         Invoice ID: {expense.object_id}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
//                         ৳{parseFloat(expense.amount).toLocaleString()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(expense.created_at)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-500">
//                         {expense.description || '-'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <button
//                         onClick={() => deleteExpense(expense.id)}
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

// export default ExpenseList;





















// components/cashbox/ExpenseList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DEFAULT_URL = "https://pos.myshopmym.com/api/cashbox/expenses/";

const ExpenseList = ({ endpoints }) => {
  const API_URL = endpoints?.expense || DEFAULT_URL;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Delete confirm modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal state
  const [editItem, setEditItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_URL);
      setExpenses(response.data);
      const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Expense লোড করতে সমস্যা হয়েছে।");
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
      fetchExpenses();
    } catch (err) {
      alert("Expense delete করতে সমস্যা হয়েছে।");
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
      fetchExpenses();
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
          <h1 className="text-2xl font-bold text-gray-800">Expense Records</h1>
          <p className="text-gray-600">All expense transactions</p>
        </div>
        <div className="bg-red-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Total Expense</p>
          <p className="text-xl font-bold text-red-600">৳{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
          <button onClick={fetchExpenses} className="ml-3 underline text-sm">আবার চেষ্টা করুন</button>
        </div>
      )}

      {/* Expense Table */}
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
                    <p className="mt-2 text-gray-600">Loading expenses...</p>
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No expense records found</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{expense.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                      {expense.object_id && (
                        <div className="text-xs text-gray-500">Invoice ID: {expense.object_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                        ৳{parseFloat(expense.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(expense.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{expense.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setEditItem({ ...expense })}
                        className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(expense.id)}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Expense?</h3>
            <p className="text-gray-600 mb-6">এই expense record টি মুছে ফেলবেন? এটি আর ফেরত আনা যাবে না।</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Expense</h3>

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

export default ExpenseList;
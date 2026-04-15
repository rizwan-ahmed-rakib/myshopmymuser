// // AddEmployeeSalaryAdvanceModal.jsx

// import React, { useState } from "react";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

// const AddEmployeeLoanModal = ({ isOpen, onClose, onSuccess }) => {

//     const { allProfile } = useUserWithProfile();

//     const [form, setForm] = useState({
//         user: "",
//         amount: "",
//         reason: "",
//         request_date:"",
//         is_approved:false,
//     });

//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});

//     if (!isOpen) return null;

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrors({});

//         // Validation
//         if (!form.user) {
//             setErrors({ user: "Employee is required" });
//             setLoading(false);
//             return;
//         }

//         if (!form.amount) {
//             setErrors({ amount: "Amount is required" });
//             setLoading(false);
//             return;
//         }

//         try {
//             const payload = {
//                 user: form.user, // 👈 selected user ID
//                 amount: Number(form.amount),
//                 reason: form.reason,
//             };

//             const res = await axios.post(
//                 `${BASE_URL_of_POS}/api/users/employee-loans/`,
//                 payload
//             );

//             onSuccess?.(res.data);
//             onClose();

//             // reset
//             setForm({
//                 user: "",
//                 amount: "",
//                 reason: "",
//             });

//         } catch (err) {
//             console.error(err);
//             alert("Failed to add salary advance");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

//                 {/* Header */}
//                 <div className="border-b p-4 flex justify-between items-center">
//                     <h2 className="text-xl font-bold">Add Salary Advance</h2>
//                     <button onClick={onClose} className="text-xl">×</button>
//                 </div>

//                 {/* Body */}
//                 <form onSubmit={handleSubmit} className="p-5 space-y-4">

//                     {/* ✅ USER DROPDOWN */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Select Employee *
//                         </label>

//                         <select
//                             name="user"
//                             value={form.user}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         >
//                             <option value="">-- Select Employee --</option>

//                             {allProfile?.map((emp) => (
//                                 <option key={emp.id} value={emp.id}>
//                                     {emp.name} ({emp.role})
//                                 </option>
//                             ))}
//                         </select>

//                         {errors.user && (
//                             <p className="text-red-500 text-sm">{errors.user}</p>
//                         )}
//                     </div>

//                     {/* Amount */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Amount (৳)
//                         </label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={form.amount}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         />
//                         {errors.amount && (
//                             <p className="text-red-500 text-sm">{errors.amount}</p>
//                         )}
//                     </div>

//                     {/* Reason */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Reason
//                         </label>
//                         <textarea
//                             name="reason"
//                             value={form.reason}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex justify-end gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border rounded"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-6 py-2 bg-blue-600 text-white rounded"
//                         >
//                             {loading ? "Adding..." : "Add"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddEmployeeLoanModal;














import React, { useState } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

const AddEmployeeLoanModal = ({ isOpen, onClose, onSuccess }) => {

    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        user: "",
        amount: "",
        loan_date: "",
        reason: "",
        repayment_start_date: "",
        monthly_repayment_amount: "",
        is_fully_paid: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErrors({});

        if (!form.user) {
            setErrors({ user: "Employee required" });
            setLoading(false);
            return;
        }

        if (!form.amount) {
            setErrors({ amount: "Amount required" });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                user: form.user,
                amount: Number(form.amount),
                loan_date: form.loan_date,
                reason: form.reason,
                repayment_start_date: form.repayment_start_date,
                monthly_repayment_amount: Number(form.monthly_repayment_amount),
                is_fully_paid: form.is_fully_paid
            };

            const res = await axios.post(
                `${BASE_URL_of_POS}/api/users/employee-loans/`,
                payload
            );

            onSuccess?.(res.data);
            onClose();

            setForm({
                user: "",
                amount: "",
                loan_date: "",
                reason: "",
                repayment_start_date: "",
                monthly_repayment_amount: "",
                is_fully_paid: false
            });

        } catch (err) {
            console.error(err);
            alert("Failed to add loan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

                {/* HEADER */}
                <div className="border-b p-4 flex justify-between">
                    <h2 className="text-lg font-bold">Add Employee Loan</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* USER */}
                    <select
                        name="user"
                        value={form.user}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Employee</option>
                        {allProfile?.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.role})
                            </option>
                        ))}
                    </select>

                    {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}

                    {/* AMOUNT */}
                    <input
                        type="number"
                        name="amount"
                        placeholder="Loan Amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {/* LOAN DATE */}
                    <input
                        type="date"
                        name="loan_date"
                        value={form.loan_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {/* REASON */}
                    <textarea
                        name="reason"
                        placeholder="Reason"
                        value={form.reason}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {/* REPAYMENT START */}
                    <input
                        type="date"
                        name="repayment_start_date"
                        value={form.repayment_start_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {/* MONTHLY REPAYMENT */}
                    <input
                        type="number"
                        name="monthly_repayment_amount"
                        placeholder="Monthly Repayment Amount"
                        value={form.monthly_repayment_amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {/* FULLY PAID */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_fully_paid"
                            checked={form.is_fully_paid}
                            onChange={handleChange}
                        />
                        Fully Paid
                    </label>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>

                        <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded">
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddEmployeeLoanModal;
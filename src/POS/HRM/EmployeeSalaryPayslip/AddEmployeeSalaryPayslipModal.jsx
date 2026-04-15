// // AddEmployeeSalaryAdvanceModal.jsx

// import React, { useState } from "react";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

// const AddEmployeeSalaryPayslipModal = ({ isOpen, onClose, onSuccess }) => {

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
//                 `${BASE_URL_of_POS}/api/users/payslips/`,
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

// export default AddEmployeeSalaryPayslipModal;



















import React, { useState } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

const AddEmployeeSalaryPayslipModal = ({ isOpen, onClose, onSuccess }) => {

    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        user: "",
        month: "",
        year: "",
        basic_salary: "",
        allowances: "",
        deductions: "",
        net_salary: "",
        payment_date: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 👉 Auto calculate net salary
    const calculateNetSalary = () => {
        const basic = Number(form.basic_salary) || 0;
        const allowance = Number(form.allowances) || 0;
        const deduction = Number(form.deductions) || 0;

        const net = basic + allowance - deduction;

        setForm(prev => ({
            ...prev,
            net_salary: net
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

        try {
            const payload = {
                user: form.user,
                month: Number(form.month),
                year: Number(form.year),
                basic_salary: Number(form.basic_salary),
                allowances: Number(form.allowances),
                deductions: Number(form.deductions),
                net_salary: Number(form.net_salary),
                payment_date: form.payment_date
            };

            const res = await axios.post(
                `${BASE_URL_of_POS}/api/users/payslips/`,
                payload
            );

            onSuccess?.(res.data);
            onClose();

            setForm({
                user: "",
                month: "",
                year: "",
                basic_salary: "",
                allowances: "",
                deductions: "",
                net_salary: "",
                payment_date: ""
            });

        } catch (err) {
            console.error(err);
            alert("Failed to add payslip");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

                {/* HEADER */}
                <div className="border-b p-4 flex justify-between">
                    <h2 className="text-lg font-bold">Add Salary Payslip</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* USER */}
                    <select name="user" value={form.user} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select Employee</option>
                        {allProfile?.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.role})
                            </option>
                        ))}
                    </select>

                    {/* MONTH & YEAR */}
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" name="month" placeholder="Month (1-12)" value={form.month} onChange={handleChange} className="p-2 border rounded" />
                        <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* SALARY */}
                    <input type="number" name="basic_salary" placeholder="Basic Salary" value={form.basic_salary} onChange={handleChange} className="w-full p-2 border rounded" />

                    <input type="number" name="allowances" placeholder="Allowances" value={form.allowances} onChange={handleChange} className="w-full p-2 border rounded" />

                    <input type="number" name="deductions" placeholder="Deductions" value={form.deductions} onChange={handleChange} className="w-full p-2 border rounded" />

                    {/* NET SALARY */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="net_salary"
                            placeholder="Net Salary"
                            value={form.net_salary}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                        <button
                            type="button"
                            onClick={calculateNetSalary}
                            className="px-3 bg-green-600 text-white rounded"
                        >
                            Calc
                        </button>
                    </div>

                    {/* PAYMENT DATE */}
                    {/* <input
                        type="date"
                        name="payment_date"
                        value={form.payment_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    /> */}

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

export default AddEmployeeSalaryPayslipModal;
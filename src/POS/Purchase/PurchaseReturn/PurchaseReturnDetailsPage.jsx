import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBoxOpen,
  FaDollarSign,
  FaUndo,
  FaEdit,
  FaFilePdf,
  FaInfoCircle,
  FaShoppingCart,
  FaUser,
  FaMoneyBillWave,
  FaMobileAlt,
  FaUniversity,
  FaExclamationTriangle,
  FaTruck,
} from "react-icons/fa";

import BASE_URL_of_POS from "../../../posConfig";
import EditPurchaseReturnModal from "./EditPurchaseReturnModal";
import SuccessModal from "./SuccessModal";
import { downloadPurchasePDF } from "./usePurchasePDF";

const PurchaseReturnDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchaseReturn, setPurchaseReturn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);

  // ================= FETCH DETAILS =================
  const fetchDetails = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL_of_POS}/api/purchase/purchase-returns/${id}/`
      );
      setPurchaseReturn(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase return:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // ================= EDIT SUCCESS =================
  const handleEditSuccess = (data) => {
    setPurchaseReturn(data);
    setUpdatedData(data);
    setEditOpen(false);
    setShowSuccessModal(true);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!purchaseReturn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <FaExclamationTriangle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Purchase Return Not Found</h2>
          <button
            onClick={() => navigate("/purchase/purchase-return")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // ================= INFO CARD =================
  const InfoCard = ({ icon, title, value, colorClass = "text-gray-900" }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{title}</p>
        <p className={`font-bold text-base ${colorClass}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/purchase/purchase-return")}
          className="flex items-center text-gray-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
        >
          <FaUndo className="mr-2" />
          Back to Purchase Returns
        </button>

        {/* ================= HEADER & SUMMARY ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gray-800 p-6 flex flex-col md:flex-row justify-between items-center text-white">
            <div>
              <h1 className="text-3xl font-bold">Purchase Return Details</h1>
              <p className="opacity-75">Purchase Invoice #{purchaseReturn.purchase_invoice_no} | Return ID: {purchaseReturn.id}</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setEditOpen(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
              >
                <FaEdit /> Edit Return
              </button>
              <button
                onClick={() => downloadPurchasePDF(purchaseReturn)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 transition backdrop-blur-sm border border-white/20"
              >
                <FaFilePdf /> Download PDF
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Supplier & Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <FaTruck className="text-blue-500" /> Supplier Information
                </h3>
                <div className="space-y-3">
                    <InfoCard 
                        icon={<FaUser className="text-blue-500" />} 
                        title="Supplier" 
                        value={purchaseReturn.supplier_name || "N/A"} 
                    />
                    <InfoCard 
                        icon={<FaInfoCircle className="text-indigo-500" />} 
                        title="Payment Status" 
                        value={purchaseReturn.payment_status?.toUpperCase() || "UNPAID"}
                        colorClass={
                            purchaseReturn.payment_status === 'paid' ? "text-green-600" : 
                            purchaseReturn.payment_status === 'partial' ? "text-yellow-600" : "text-red-600"
                        }
                    />
                    <InfoCard 
                        icon={<FaBoxOpen className="text-yellow-500" />} 
                        title="Return Date" 
                        value={new Date(purchaseReturn.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })} 
                    />
                </div>
              </div>

              {/* Middle Column: Financial Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <FaDollarSign className="text-green-500" /> Financial Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <InfoCard icon={<FaShoppingCart className="text-blue-500" />} title="Gross Total" value={`৳${purchaseReturn.total_return_amount}`} />
                    <InfoCard icon={<FaExclamationTriangle className="text-red-500" />} title="Item Penalty" value={`৳${purchaseReturn.total_item_penalty || 0}`} />
                    <InfoCard icon={<FaExclamationTriangle className="text-red-600" />} title="Global Penalty" value={`৳${purchaseReturn.global_penalty || 0}`} />
                    <InfoCard icon={<FaMoneyBillWave className="text-green-600" />} title="Net Return" value={`৳${purchaseReturn.net_return_amount}`} colorClass="text-green-600" />
                </div>
                <div className="pt-2">
                    <InfoCard 
                        icon={<FaDollarSign className="text-red-600" />} 
                        title="Balance Due" 
                        value={`৳${purchaseReturn.due_amount}`} 
                        colorClass="text-red-600 text-xl"
                    />
                </div>
              </div>

              {/* Right Column: Payment Details (Refunds from Supplier) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <FaMoneyBillWave className="text-purple-500" /> Payment Details
                </h3>
                <div className="space-y-3">
                    {Number(purchaseReturn.paid_cash) > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span className="flex items-center gap-2 text-sm font-medium"><FaMoneyBillWave className="text-green-500" /> Cash</span>
                            <span className="font-bold">৳{purchaseReturn.paid_cash}</span>
                        </div>
                    )}
                    {Number(purchaseReturn.paid_mobile) > 0 && (
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="flex items-center gap-2 text-sm font-bold text-blue-700"><FaMobileAlt /> Mobile ({purchaseReturn.mobile_operator})</span>
                                <span className="font-bold text-blue-800">৳{purchaseReturn.paid_mobile}</span>
                            </div>
                        </div>
                    )}
                    {Number(purchaseReturn.paid_bank) > 0 && (
                        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="flex items-center gap-2 text-sm font-bold text-purple-700"><FaUniversity /> Bank</span>
                                <span className="font-bold text-purple-800">৳{purchaseReturn.paid_bank}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center p-3 bg-green-600 text-white rounded-xl shadow-md">
                        <span className="text-sm font-bold uppercase tracking-wider">Total Received Back</span>
                        <span className="text-lg font-black font-mono">৳{Number(purchaseReturn.paid_amount).toFixed(2)}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* REASON & NOTE */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-xs font-bold text-red-600 uppercase mb-1">Return Reason</p>
                    <p className="text-gray-800 font-medium">{purchaseReturn.return_reason || "No reason specified"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Internal Note</p>
                    <p className="text-gray-800 font-medium">{purchaseReturn.note || "No internal notes"}</p>
                </div>
            </div>
          </div>
        </div>

        {/* ================= ITEMS ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Returned Items Breakdown</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4 text-center">Purchased Qty</th>
                    <th className="px-6 py-4 text-center">Return Qty</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Penalty</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4">Reason</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {purchaseReturn.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.product_name}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{item.purchased_quantity}</td>
                    <td className="px-6 py-4 text-center">
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold text-sm">
                            {item.purchase_return_quantity}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-700">৳{item.unit_price}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-500">৳{item.penalty_amount || 0}</td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">৳{item.total_price}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm italic">{item.reason || "Supplier Return"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {editOpen && (
        <EditPurchaseReturnModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          purchase={purchaseReturn}
          onUpdated={handleEditSuccess}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          purchase={updatedData}
          title="Purchase Return Updated"
          successMessage="Purchase return updated successfully."
        />
      )}
    </div>
  );
};

export default PurchaseReturnDetailsPage;

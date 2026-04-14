


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
  FaWarehouse,
} from "react-icons/fa";

import BASE_URL_of_POS from "../../../posConfig";
import EditSaleReturnModal from "./EditSaleReturnModal";
import SuccessModal from "./SuccessModal";
import { downloadPurchasePDF } from "./usePurchasePDF";

const SaleReturnDetailsPage = () => {
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
        `${BASE_URL_of_POS}/api/sale/sale-returns/${id}/`
      );
      setPurchaseReturn(res.data);
    } catch (err) {
      console.error("Failed to fetch sale return:", err);
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
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">sale Return Not Found</h2>
          <button
            onClick={() => navigate("/sale/sale-return")}
            className="btn-primary"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ================= INFO CARD =================
  const InfoCard = ({ icon, title, value }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="font-semibold text-lg text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/sale/sale-return")}
          className="flex items-center text-gray-600 hover:text-blue-700 mb-6"
        >
          <FaUndo className="mr-2" />
          Back to Sale Returns
        </button>

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* IMAGE */}
            <div className="md:w-1/3">
              <img
                src={
                  purchaseReturn.customer_image ||
                  "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
                }
                alt={purchaseReturn.customer_name}
                className="w-full h-80 object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src = "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg")
                }
              />
            </div>

            {/* DETAILS */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold">
                    Saale Return – Invoice #
                    {purchaseReturn.sale_invoice_no}
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Supplier: {purchaseReturn.supplier_name}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => downloadPurchasePDF(purchaseReturn)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <FaFilePdf /> PDF
                  </button>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <InfoCard
                  icon={<FaShoppingCart className="text-red-500" />}
                  title="Total Return"
                  value={`৳${purchaseReturn.total_return_amount}`}
                />
                <InfoCard
                  icon={<FaDollarSign className="text-green-500" />}
                  title="Paid"
                  value={`৳${purchaseReturn.paid_amount}`}
                />
                <InfoCard
                  icon={<FaDollarSign className="text-orange-500" />}
                  title="Due"
                  value={`৳${purchaseReturn.due_amount}`}
                />
                <InfoCard
                  icon={<FaWarehouse className="text-purple-500" />}
                  title="Payment Method"
                  value={purchaseReturn.payment_method || "—"}
                />
                <InfoCard
                  icon={<FaInfoCircle className="text-indigo-500" />}
                  title="Payment Status"
                  value={purchaseReturn.payment_status}
                />
                <InfoCard
                  icon={<FaBoxOpen className="text-yellow-500" />}
                  title="Returned At"
                  value={new Date(
                    purchaseReturn.created_at
                  ).toLocaleString()}
                />

                <InfoCard
                  icon={<FaBoxOpen className="text-yellow-500" />}
                  title="Updated At"
                  value={new Date(
                    purchaseReturn.updated_at
                  ).toLocaleString()}
                />
              </div>

              {/* NOTE */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Return Reason:</strong>{" "}
                  {purchaseReturn.return_reason || "—"}
                </p>
                <p className="mt-2">
                  <strong>Note:</strong> {purchaseReturn.note || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ITEMS ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Returned Items</h2>

          <table className="w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Sold Qty</th>
                <th className="px-4 py-2">Returned Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {purchaseReturn.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.product_name}</td>
                  <td className="px-4 py-2">{item.sold_quantity}</td>
                  <td className="px-4 py-2 text-red-600 font-semibold">
                    {/*{item.quantity}*/}
                    {item.sale_return_quantity}
                  </td>
                  <td className="px-4 py-2">৳{item.unit_price}</td>
                  <td className="px-4 py-2">৳{item.total_price}</td>
                  <td className="px-4 py-2">{item.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {editOpen && (
        <EditSaleReturnModal
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
          title="Sale Return Updated"
          successMessage="Sale return updated successfully."
        />
      )}
    </div>
  );
};

export default SaleReturnDetailsPage;

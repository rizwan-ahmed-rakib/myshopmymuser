import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {
    FaBoxOpen,
    FaDollarSign,
    FaShoppingCart,
    FaWarehouse,
    FaInfoCircle,
    FaFilePdf,
    FaEdit,
    FaUndo,
} from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";
import EditSaleModal from "./EditSaleModal";
import SaleReturnModal from "./SaleReturnModal";
import SaleReturnSuccessModal from "./SaleReturnSuccessModal"; // Import the new modal
import {downloadPurchasePDF} from "./usePurchasePDF"; // helper function to generate PDF
import SuccessModal from "./SuccessModal";

const SaleDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedPurchaseData, setUpdatedPurchaseData] = useState(null);
    const [returnSuccessData, setReturnSuccessData] = useState(null); // New state for return success

    const fetchPurchaseDetails = useCallback(async () => {
        try {
            const res = await axios.get(`${BASE_URL_of_POS}/api/sale/sales/${id}/`);
            setPurchase(res.data);
        } catch (error) {
            console.error("Error fetching purchase details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPurchaseDetails();
    }, [fetchPurchaseDetails]);

    const handleEditSuccess = (updatedData) => {
        setPurchase(updatedData);
        setUpdatedPurchaseData(updatedData);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handleReturnSuccess = (returnData) => {
        setReturnOpen(false);
        setReturnSuccessData(returnData);
        fetchPurchaseDetails();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-700">Loading purchase details...</p>
                </div>
            </div>
        );
    }

    if (!purchase) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Purchase Not Found</h2>
                    <button
                        onClick={() => navigate("/sale/sale")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Purchase List
                    </button>
                </div>
            </div>
        );
    }

    const InfoCard = ({icon, title, value}) => (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">{icon}</div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="font-semibold text-lg text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/sale/sale")}
                        className="flex items-center text-gray-600 hover:text-blue-700 mb-4 font-medium"
                    >
                        <FaUndo className="mr-2"/>
                        Back to Sale List
                    </button>
                </div>

                {/* Purchase Summary */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 mb-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left: Purchase Info */}
                        <div className="md:w-1/3">
                            <div
                                className="w-full h-80 rounded-lg bg-gray-200 shadow-inner flex items-center justify-center">
                                {purchase.items.length > 0 ? (
                                    <img
                                        src={purchase.customer_image || "https://via.placeholder.com/300"}
                                        alt={purchase.customer_name}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                                    />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                            </div>
                        </div>

                        {/* Right: Purchase Details */}
                        <div className="md:w-2/3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">Invoice #{purchase.invoice_no}</h1>
                                    <p className="text-gray-500 mt-2">
                                        Supplier: {purchase.supplier_name || "N/A"}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row gap-2">
                                    <button
                                        onClick={() => setEditOpen(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                                    >
                                        <FaEdit/>
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setReturnOpen(true)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700"
                                    >
                                        <FaUndo/>
                                        Return
                                    </button>

                                    <button
                                        onClick={() => downloadPurchasePDF(purchase)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
                                    >
                                        <FaFilePdf/>
                                        PDF
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                                <InfoCard icon={<FaShoppingCart className="text-blue-500"/>} title="Total Amount"
                                          value={`৳${purchase.total_amount}`}/>
                                <InfoCard icon={<FaDollarSign className="text-green-500"/>} title="Paid Amount"
                                          value={`৳${purchase.paid_amount}`}/>
                                <InfoCard icon={<FaDollarSign className="text-red-500"/>} title="Due Amount"
                                          value={`৳${purchase.due_amount}`}/>
                                <InfoCard icon={<FaWarehouse className="text-purple-500"/>} title="Payment Method"
                                          value={purchase.payment_method}/>
                                <InfoCard icon={<FaInfoCircle className="text-indigo-500"/>} title="Payment Status"
                                          value={purchase.payment_status}/>
                                <InfoCard icon={<FaBoxOpen className="text-yellow-500"/>} title="Created At"
                                          value={new Date(purchase.created_at).toLocaleString()}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Items Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Purchase Items</h2>
                    <table className="w-full table-auto border border-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b">Product</th>
                            <th className="px-4 py-2 border-b">Quantity</th>
                            <th className="px-4 py-2 border-b">Unit Price</th>
                            <th className="px-4 py-2 border-b">Total Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {purchase.items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{item.product_name}</td>
                                <td className="px-4 py-2 border-b">{item.quantity}</td>
                                <td className="px-4 py-2 border-b">৳{item.unit_price}</td>
                                <td className="px-4 py-2 border-b">৳{item.total_price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {editOpen && (
                <EditSaleModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    purchase={purchase}
                    onUpdated={handleEditSuccess}
                />
            )}

            {returnOpen && (
                <SaleReturnModal
                    isOpen={returnOpen}
                    onClose={() => setReturnOpen(false)}
                    purchase={purchase}
                    onSuccess={handleReturnSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    purchase={updatedPurchaseData}
                    title="Purchase Updated!"
                    successMessage="The purchase details have been updated."
                />
            )}

            {returnSuccessData && (
                <SaleReturnSuccessModal
                    isOpen={!!returnSuccessData}
                    onClose={() => setReturnSuccessData(null)}
                    purchase={returnSuccessData}
                    title="Purchase Return Successful!"
                    successMessage="The purchase return has been processed."
                />
            )}
        </div>
    );
};

export default SaleDetailsPage;
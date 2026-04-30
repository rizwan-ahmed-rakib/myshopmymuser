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
    FaTag,
    FaPrint,
    FaCalendarAlt,
    FaBarcode,
    FaImage,
} from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";
import EditPurchaseModal from "./EditPurchaseModal";
import PurchaseReturnModal from "./PurchaseReturnModal";
import PurchaseReturnSuccessModal from "./PurchaseReturnSuccessModal";
import {downloadPurchasePDF} from "./usePurchasePDF";
import SuccessModal from "./SuccessModal";

const PurchaseDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedPurchaseData, setUpdatedPurchaseData] = useState(null);
    const [returnSuccessData, setReturnSuccessData] = useState(null);

    const fetchPurchaseDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get(`${BASE_URL_of_POS}/api/purchase/purchases/${id}/`, { headers });
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

    /* =========================
       Print handler
       ========================= */
    const handlePrint = () => {
        const netTotal = purchase.net_total || purchase.netTotal || 0;
        const globalDiscount = purchase.global_discount || purchase.globalDiscount || 0;
        const totalDiscount = purchase.total_discount || purchase.totalDiscount || 0;
        
        const paidCash = purchase.paid_cash || 0;
        const paidMobile = purchase.paid_mobile || 0;
        const paidBank = purchase.paid_bank || 0;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Purchase Invoice - ${purchase.invoice_no}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.4; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                        .store-info h1 { margin: 0; color: #1a56db; font-size: 28px; }
                        .invoice-meta { text-align: right; }
                        .invoice-meta p { margin: 2px 0; font-weight: bold; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th { background-color: #f3f4f6; padding: 12px 8px; text-align: left; border-bottom: 2px solid #e5e7eb; font-size: 13px; text-transform: uppercase; }
                        td { padding: 12px 8px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
                        .totals-container { display: flex; justify-content: flex-end; }
                        .totals-table { width: 320px; }
                        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
                        .grand-total { border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; color: #1a56db; }
                        .payment-breakdown { font-size: 12px; color: #666; padding-left: 15px; border-left: 2px solid #eee; margin-top: 5px; }
                        .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="store-info">
                            <h1>MY SHOP POS</h1>
                            <p>Premium Inventory & Sales System</p>
                        </div>
                        <div class="invoice-meta">
                            <h2>PURCHASE INVOICE</h2>
                            <p>Invoice #: ${purchase.invoice_no}</p>
                            <p>Date: ${new Date(purchase.created_at).toLocaleDateString()}</p>
                            <p>Supplier: ${purchase.supplier_name || 'N/A'}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Discount</th>
                                <th style="text-align:right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchase.items.map(i => `
                                <tr>
                                    <td>${i.product_name}</td>
                                    <td>${i.quantity}</td>
                                    <td>৳${Number(i.unit_price).toFixed(2)}</td>
                                    <td>৳${Number(i.discount_amount || 0).toFixed(2)}</td>
                                    <td style="text-align:right">৳${Number(i.net_total).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="totals-container">
                        <div class="totals-table">
                            <div class="total-row"><span>Gross Total:</span> <span>৳${Number(purchase.total_amount).toFixed(2)}</span></div>
                            <div class="total-row"><span>Itemwise Discount:</span> <span>- ৳${Number(purchase.itemwise_total_discount).toFixed(2)}</span></div>
                            <div class="total-row"><span>Subtotal:</span> <span>৳${Number(purchase.subtotal).toFixed(2)}</span></div>
                            <div class="total-row"><span>Global Discount:</span> <span>- ৳${Number(globalDiscount).toFixed(2)}</span></div>
                            <div class="total-row grand-total"><span>NET PAYABLE:</span> <span>৳${Number(netTotal).toFixed(2)}</span></div>
                            
                            <div class="total-row" style="color: #057a55; font-weight: bold; margin-top: 10px;"><span>Total Paid:</span> <span>৳${Number(purchase.paid_amount).toFixed(2)}</span></div>
                            <div class="payment-breakdown">
                                ${paidCash > 0 ? `<div class="total-row"><span>- Cash:</span> <span>৳${Number(paidCash).toFixed(2)}</span></div>` : ''}
                                ${paidMobile > 0 ? `<div class="total-row"><span>- Mobile:</span> <span>৳${Number(paidMobile).toFixed(2)}</span></div>` : ''}
                                ${paidBank > 0 ? `<div class="total-row"><span>- Bank:</span> <span>৳${Number(paidBank).toFixed(2)}</span></div>` : ''}
                            </div>
                            
                            <div class="total-row" style="color: #c81e1e; font-weight: bold; border-top: 1px dashed #eee; margin-top: 5px; padding-top: 5px;"><span>Due Amount:</span> <span>৳${Number(purchase.due_amount).toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is a computer-generated document. No signature is required.</p>
                        <p>Thank you for choosing MY SHOP POS</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                        onClick={() => navigate("/purchase/purchase")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Purchase List
                    </button>
                </div>
            </div>
        );
    }

    const InfoCard = ({icon, title, value, colorClass = "text-gray-900"}) => (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center border border-gray-100">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">{icon}</div>
            <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{title}</p>
                <p className={`font-black text-base ${colorClass}`}>{value}</p>
            </div>
        </div>
    );

    const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(purchase?.supplier_due_amount) || 0) - originalInvoiceDue;
    const totalSupplierDue = otherInvoicesDue + (parseFloat(purchase?.due_amount) || 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button
                        onClick={() => navigate("/purchase/purchase")}
                        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-bold uppercase text-xs tracking-widest"
                    >
                        <FaUndo className="mr-2"/>
                        Back to List
                    </button>

                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Print Invoice"><FaPrint size={18}/></button>
                        <button onClick={() => downloadPurchasePDF(purchase)} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Download PDF"><FaFilePdf size={18}/></button>
                        <button onClick={() => setEditOpen(true)} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Edit Purchase"><FaEdit size={18}/></button>
                        <button onClick={() => setReturnOpen(true)} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Return Items"><FaUndo size={18}/></button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-gradient-to-r from-gray-900 to-blue-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                             <FaShoppingCart size={200} className="translate-x-20 -translate-y-10 rotate-12"/>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
                                    <img
                                        src={purchase.supplier_image || "https://via.placeholder.com/150"}
                                        className="w-full h-full object-cover"
                                        alt="Supplier"
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">Invoice #{purchase.invoice_no}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-blue-500/20 text-blue-200 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                                            {purchase.payment_status}
                                        </span>
                                        <span className="text-blue-200 font-medium text-sm">| {purchase.supplier_name || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-2xl text-center">
                                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest mb-1">Invoice Due</p>
                                    <p className="text-2xl font-black text-red-400">৳{purchase.due_amount}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 shadow-2xl text-center">
                                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest mb-1">Total Balance</p>
                                    <p className="text-3xl font-black">৳{totalSupplierDue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <InfoCard icon={<FaShoppingCart className="text-blue-500"/>} title="Gross Total" value={`৳${purchase.total_amount}`}/>
                            <InfoCard icon={<FaTag className="text-green-500"/>} title="Total Discount" value={`৳${purchase.total_discount || purchase.totalDiscount}`} colorClass="text-green-600"/>
                            <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-center border border-gray-100">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Paid Breakdown</p>
                                <div className="space-y-0.5">
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Cash:</span><span className="font-bold">৳{purchase.paid_cash || 0}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Mobile:</span><span className="font-bold">৳{purchase.paid_mobile || 0}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Bank:</span><span className="font-bold">৳{purchase.paid_bank || 0}</span></div>
                                </div>
                            </div>
                            <InfoCard icon={<FaDollarSign className="text-blue-500"/>} title="Previous Due" value={`৳${otherInvoicesDue.toFixed(2)}`} colorClass="text-blue-600"/>   
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t pt-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><FaWarehouse size={20}/></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Payment Method</p>
                                    <p className="font-bold text-gray-700 capitalize">{purchase.payment_method?.replace('_', ' ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><FaInfoCircle size={20}/></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
                                    <p className="font-bold text-gray-700 capitalize">{purchase.payment_status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><FaBoxOpen size={20}/></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Date</p>
                                    <p className="font-bold text-gray-700">{new Date(purchase.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            {purchase.payment_proof && (
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-50 rounded-xl text-green-600"><FaImage size={20}/></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Proof Image</p>
                                        <a href={`${BASE_URL_of_POS}${purchase.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-sm">View Attachment</a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {(purchase.mobile_operator || purchase.transaction_id || purchase.bank_account_no) && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {purchase.mobile_operator && (
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Mobile Operator</p>
                                        <p className="font-bold text-gray-700 capitalize">{purchase.mobile_operator}</p>
                                    </div>
                                )}
                                {purchase.transaction_id && (
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Transaction ID</p>
                                        <p className="font-bold text-gray-700 uppercase">{purchase.transaction_id}</p>
                                    </div>
                                )}
                                {purchase.bank_account_no && (
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Bank A/C No</p>
                                        <p className="font-bold text-gray-700">{purchase.bank_account_no}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Purchase Items</h2>
                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">{purchase.items.length} Items</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest bg-gray-50">
                                    <th className="px-8 py-4">Product Details</th>
                                    <th className="px-8 py-4 text-center">Qty</th>
                                    <th className="px-8 py-4 text-right">Unit Price</th>
                                    <th className="px-8 py-4 text-right">Discount</th>
                                    <th className="px-8 py-4 text-right">Net Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {purchase.items.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <tr className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <p className="font-bold text-gray-800">{item.product_name}</p>
                                                {item.batch_no && (
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        <FaBarcode className="text-blue-400" /> {item.batch_no}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-center font-mono font-bold text-gray-600">{item.quantity}</td>
                                            <td className="px-8 py-5 text-right font-mono text-gray-600">৳{item.unit_price}</td>
                                            <td className="px-8 py-5 text-right font-mono text-green-600">৳{item.discount_amount}</td>
                                            <td className="px-8 py-5 text-right font-mono font-black text-blue-700">৳{item.net_total}</td>
                                        </tr>
                                        {item.expiry_date && (
                                            <tr className="bg-blue-50/20">
                                                <td colSpan="5" className="px-8 py-2">
                                                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-wider">
                                                        <div className="flex items-center gap-1.5 text-blue-600">
                                                            <FaCalendarAlt /> Mfg: {item.manufacturing_date}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-red-600">
                                                            <FaCalendarAlt /> Exp: {item.expiry_date}
                                                        </div>
                                                        <div className={`px-2 py-0.5 rounded-full border ${
                                                            item.expiry_status === 'expired' ? 'bg-red-100 text-red-700 border-red-200' : 
                                                            item.expiry_status === 'near_expiry' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                                            'bg-green-100 text-green-700 border-green-200'
                                                        }`}>
                                                            {item.expiry_status}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-900 p-8 text-white">
                        <div className="max-w-xs ml-auto space-y-3">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Gross Total</span>
                                <span className="font-mono">৳{purchase.total_amount}</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                                <span>Itemwise Discount</span>
                                <span className="font-mono">- ৳{purchase.itemwise_total_discount}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-800 pt-3 font-bold">
                                <span>Subtotal</span>
                                <span className="font-mono">৳{purchase.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                                <span>Global Discount</span>
                                <span className="font-mono">- ৳{purchase.global_discount || purchase.globalDiscount}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-gray-700">
                                <span>Net Payable</span>
                                <span className="font-mono">৳{purchase.net_total || purchase.netTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && (
                <EditPurchaseModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    purchase={purchase}
                    onUpdated={handleEditSuccess}
                />
            )}

            {returnOpen && (
                <PurchaseReturnModal
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
                    invoice={updatedPurchaseData}
                    previousDue={otherInvoicesDue}
                />
            )}

            {returnSuccessData && (
                <PurchaseReturnSuccessModal
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

export default PurchaseDetailsPage;

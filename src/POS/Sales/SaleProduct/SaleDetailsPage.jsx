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
    FaUser,
} from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";
import EditSaleModal from "./EditSaleModal";
import SaleReturnModal from "./SaleReturnModal";
import SaleReturnSuccessModal from "./SaleReturnSuccessModal";
import SuccessModal from "./SuccessModal";

const SaleDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedSaleData, setUpdatedSaleData] = useState(null);
    const [returnSuccessData, setReturnSuccessData] = useState(null);

    const fetchSaleDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get(`${BASE_URL_of_POS}/api/sale/sales/${id}/`, { headers });
            setSale(res.data);
        } catch (error) {
            console.error("Error fetching sale details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSaleDetails();
    }, [fetchSaleDetails]);

    const handleEditSuccess = (updatedData) => {
        setSale(updatedData);
        setUpdatedSaleData(updatedData);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handleReturnSuccess = (returnData) => {
        setReturnOpen(false);
        setReturnSuccessData(returnData);
        fetchSaleDetails();
    };

    const handlePrint = () => {
        const netTotal = sale.net_total || sale.netTotal || 0;
        const globalDiscount = sale.global_discount || sale.globalDiscount || 0;
        
        const paidCash = sale.paid_cash || 0;
        const paidMobile = sale.paid_mobile || 0;
        const paidBank = sale.paid_bank || 0;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Sale Invoice - ${sale.invoice_no}</title>
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
                        .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="store-info"><h1>MY SHOP POS</h1><p>Premium Sales System</p></div>
                        <div class="invoice-meta">
                            <h2>SALE INVOICE</h2>
                            <p>Invoice #: ${sale.invoice_no}</p>
                            <p>Date: ${new Date(sale.created_at).toLocaleDateString()}</p>
                            <p>Customer: ${sale.customer_name || 'Walk-in'}</p>
                        </div>
                    </div>
                    <table>
                        <thead><tr><th>Product Details</th><th>Quantity</th><th>Unit Price</th><th>Discount</th><th style="text-align:right">Total</th></tr></thead>
                        <tbody>
                            ${sale.items.map(i => `
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
                            <div class="total-row"><span>Gross Total:</span> <span>৳${Number(sale.total_amount).toFixed(2)}</span></div>
                            <div class="total-row"><span>Global Discount:</span> <span>- ৳${Number(globalDiscount).toFixed(2)}</span></div>
                            <div class="total-row grand-total"><span>NET PAYABLE:</span> <span>৳${Number(netTotal).toFixed(2)}</span></div>
                            <div class="total-row" style="color: #057a55; font-weight: bold; margin-top: 10px;"><span>Total Received:</span> <span>৳${Number(sale.paid_amount).toFixed(2)}</span></div>
                            <div class="total-row" style="color: #c81e1e; font-weight: bold; border-top: 1px dashed #eee; margin-top: 5px; padding-top: 5px;"><span>Due Amount:</span> <span>৳${Number(sale.due_amount).toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div class="footer"><p>Thank you for shopping with us!</p></div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading sale details...</div>;
    if (!sale) return <div className="min-h-screen flex items-center justify-center font-bold">Sale Not Found</div>;

    const InfoCard = ({icon, title, value, colorClass = "text-gray-900"}) => (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center border border-gray-100">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">{icon}</div>
            <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{title}</p>
                <p className={`font-black text-base ${colorClass}`}>{value}</p>
            </div>
        </div>
    );

    const originalInvoiceDue = parseFloat(sale?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(sale?.customer_due_amount) || 0) - originalInvoiceDue;
    const totalCustomerDue = otherInvoicesDue + (parseFloat(sale?.due_amount) || 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button onClick={() => navigate("/sales")} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-bold uppercase text-xs tracking-widest"><FaUndo className="mr-2"/>Back to List</button>
                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Print Invoice"><FaPrint size={18}/></button>
                        <button onClick={() => setEditOpen(true)} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Edit Sale"><FaEdit size={18}/></button>
                        <button onClick={() => setReturnOpen(true)} className="p-2 bg-white text-gray-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-gray-200" title="Return Items"><FaUndo size={18}/></button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-gradient-to-r from-gray-900 to-indigo-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10 backdrop-blur-sm">
                                    <img src={sale.customer_image || "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"} className="w-full h-full object-cover" alt="Customer" onError={(e) => (e.target.src = "https://via.placeholder.com/150")}/>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">Invoice #{sale.invoice_no}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-indigo-500/20 text-indigo-200 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">{sale.payment_status}</span>
                                        <span className="text-indigo-200 font-medium text-sm">| {sale.customer_name || "Walk-in Customer"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-2xl text-center">
                                    <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest mb-1">Invoice Due</p>
                                    <p className="text-2xl font-black text-red-400">৳{sale.due_amount}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 shadow-2xl text-center">
                                    <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest mb-1">Customer Balance</p>
                                    <p className="text-3xl font-black">৳{totalCustomerDue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <InfoCard icon={<FaShoppingCart className="text-blue-500"/>} title="Gross Total" value={`৳${sale.total_amount}`}/>
                            <InfoCard icon={<FaTag className="text-green-500"/>} title="Total Discount" value={`৳${sale.total_discount || sale.totalDiscount}`} colorClass="text-green-600"/>
                            <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-center border border-gray-100">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Received Breakdown</p>
                                <div className="space-y-0.5">
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Cash:</span><span className="font-bold">৳{sale.paid_cash || 0}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Mobile:</span><span className="font-bold">৳{sale.paid_mobile || 0}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Bank:</span><span className="font-bold">৳{sale.paid_bank || 0}</span></div>
                                </div>
                            </div>
                            <InfoCard icon={<FaDollarSign className="text-blue-500"/>} title="Previous Due" value={`৳${otherInvoicesDue.toFixed(2)}`} colorClass="text-blue-600"/>   
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t pt-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><FaWarehouse size={20}/></div>
                                <div><p className="text-[10px] uppercase font-bold text-gray-400">Method</p><p className="font-bold text-gray-700 capitalize">{sale.payment_method?.replace('_', ' ')}</p></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><FaInfoCircle size={20}/></div>
                                <div><p className="text-[10px] uppercase font-bold text-gray-400">Status</p><p className="font-bold text-gray-700 capitalize">{sale.payment_status}</p></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><FaBoxOpen size={20}/></div>
                                <div><p className="text-[10px] uppercase font-bold text-gray-400">Date</p><p className="font-bold text-gray-700">{new Date(sale.created_at).toLocaleString()}</p></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><FaUser size={20}/></div>
                                <div><p className="text-[10px] uppercase font-bold text-gray-400">Customer</p><p className="font-bold text-gray-700">{sale.customer_name || "Walk-in"}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Sale Items</h2>
                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">{sale.items.length} Items</span>
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
                                {sale.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5"><p className="font-bold text-gray-800">{item.product_name}</p></td>
                                        <td className="px-8 py-5 text-center font-mono font-bold text-gray-600">{item.quantity}</td>
                                        <td className="px-8 py-5 text-right font-mono text-gray-600">৳{item.unit_price}</td>
                                        <td className="px-8 py-5 text-right font-mono text-green-600">৳{item.discount_amount}</td>
                                        <td className="px-8 py-5 text-right font-mono font-black text-blue-700">৳{item.net_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-900 p-8 text-white">
                        <div className="max-w-xs ml-auto space-y-3">
                            <div className="flex justify-between text-gray-400 text-sm"><span>Gross Total</span><span className="font-mono">৳{sale.total_amount}</span></div>
                            <div className="flex justify-between text-green-400 text-sm"><span>Itemwise Discount</span><span className="font-mono">- ৳{sale.itemwise_total_discount}</span></div>
                            <div className="flex justify-between border-t border-gray-800 pt-3 font-bold"><span>Subtotal</span><span className="font-mono">৳{sale.subtotal}</span></div>
                            <div className="flex justify-between text-green-400 text-sm"><span>Global Discount</span><span className="font-mono">- ৳{sale.global_discount || sale.globalDiscount}</span></div>
                            <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-gray-700"><span>Net Payable</span><span className="font-mono">৳{sale.net_total || sale.netTotal}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && <EditSaleModal open={editOpen} onClose={() => setEditOpen(false)} purchase={sale} onUpdated={handleEditSuccess} />}
            {returnOpen && <SaleReturnModal isOpen={returnOpen} onClose={() => setReturnOpen(false)} purchase={sale} onSuccess={handleReturnSuccess} />}
            {showSuccessModal && <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} invoice={updatedSaleData} previousDue={otherInvoicesDue} />}
            
            {returnSuccessData && (
                <SaleReturnSuccessModal
                    isOpen={!!returnSuccessData}
                    onClose={() => setReturnSuccessData(null)}
                    purchase={returnSuccessData}
                    title="Sale Return Successful!"
                    successMessage="The sale return has been processed."
                />
            )}
        </div>
    );
};

export default SaleDetailsPage;
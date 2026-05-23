import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ProductHeader from "./ProductHeader";
import ProductStats from "./ProductStats";
import SaleSearchFilter from "./SaleSearchFilter";
import SaleCard from "./SaleCard";
import SaleList from "./SaleList";
import AddSaleModal from "./AddSaleModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EditSaleModal from "./EditSaleModal";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import {usePosSaleProducts} from "../../../context_or_provider/pos/Sale/saleProduct/PosSaleProduct_provider";

const SaleGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
    const {posSaleProduct, setPosSaleProduct} = usePosSaleProducts();

    const [editingSale, setEditingSale] = useState(null);

    const [addSuccessData, setAddSuccessData] = useState(null);
    const [updateSuccessData, setUpdateSuccessData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        customer: "all",
        status: "all",
        method: "all",
        sortBy: "date_desc",
        startDate: "",
        endDate: ""
    });

    const fetchSales = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posSaleProductAPI.getAll();
            setPosSaleProduct(response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosSaleProduct]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    }, []);

    const filteredSales = useMemo(() => {
        if (!posSaleProduct || posSaleProduct.length === 0) return [];
        let result = [...posSaleProduct];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(sale => 
                sale.invoice_no?.toLowerCase().includes(query)
            );
        }

        if (filters.customer && filters.customer !== "all") {
            result = result.filter(sale => sale.customer?.toString() === filters.customer);
        }

        if (filters.status && filters.status !== "all") {
            result = result.filter(sale => sale.payment_status === filters.status);
        }

        if (filters.method && filters.method !== "all") {
            result = result.filter(sale => sale.payment_method === filters.method);
        }

        if (filters.startDate) {
            result = result.filter(sale => new Date(sale.created_at) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(sale => new Date(sale.created_at) <= end);
        }

        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "date_desc": return new Date(b.created_at) - new Date(a.created_at);
                case "date_asc": return new Date(a.created_at) - new Date(b.created_at);
                case "invoice_asc": return (a.invoice_no || '').localeCompare(b.invoice_no || '', undefined, {numeric: true});
                case "invoice_desc": return (b.invoice_no || '').localeCompare(a.invoice_no || '', undefined, {numeric: true});
                case "due_desc": return parseFloat(b.due_amount) - parseFloat(a.due_amount);
                default: return new Date(b.created_at) - new Date(a.created_at);
            }
        });
        return result;
    }, [posSaleProduct, searchQuery, filters]);

    const totals = useMemo(() => {
        return filteredSales.reduce((acc, curr) => ({
            net_total: acc.net_total + parseFloat(curr.net_total || curr.netTotal || 0),
            paid_amount: acc.paid_amount + parseFloat(curr.paid_amount || 0),
            due_amount: acc.due_amount + parseFloat(curr.due_amount || 0),
        }), { net_total: 0, paid_amount: 0, due_amount: 0 });
    }, [filteredSales]);

    const handleAddSuccess = (newSale) => {
        setIsAddOpen(false);
        setAddSuccessData(newSale);
        fetchSales();
    };

    const handleUpdateSuccess = (updatedData) => {
        setEditingSale(null);
        setUpdateSuccessData(updatedData);
        fetchSales();
    };

    const handleDeleteSuccess = () => {
        fetchSales();
    }

    const formatMoney = (value) =>
        (value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const displayStats = [
        { title: 'Total Invoices', count: filteredSales.length.toString(), bgColor: 'bg-blue-600', icon: '🧾' },
        { title: 'Total Sales', count: `৳${formatMoney(totals.net_total)}`, bgColor: 'bg-indigo-600', icon: '💰' },
        { title: 'Total Received', count: `৳${formatMoney(totals.paid_amount)}`, bgColor: 'bg-green-600', icon: '✅' },
        { title: 'Total Due', count: `৳${formatMoney(totals.due_amount)}`, bgColor: 'bg-red-600', icon: '⏳' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">Loading sales history...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mb-6">
                <ProductStats stats={displayStats}/>
            </div>
            <div className="mb-6">
                <SaleSearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        Sales History
                    </h2>
                    <div className="text-sm text-gray-500 font-bold">
                        Showing {filteredSales.length} of {posSaleProduct?.length || 0} invoices
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSales.map(sale => (
                            <SaleCard
                                key={sale.id}
                                product={sale}
                                onEdit={() => setEditingSale(sale)}
                                onDelete={handleDeleteSuccess}
                            />
                        ))}
                    </div>
                ) : (
                    <SaleList
                        products={filteredSales}
                        onEdit={(sale) => setEditingSale(sale)}
                        onDelete={handleDeleteSuccess}
                    />
                )}
            </div>

            <AddSaleModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {editingSale && (
                 <EditSaleModal
                    open={!!editingSale}
                    onClose={() => setEditingSale(null)}
                    purchase={editingSale}
                    onUpdated={handleUpdateSuccess}
                />
            )}

            <SuccessModal
                isOpen={!!addSuccessData}
                invoice={addSuccessData}
                onClose={() => setAddSuccessData(null)}
            />

            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    invoice={updateSuccessData}
                />
            )}
        </div>
    );
};

export default SaleGrid;
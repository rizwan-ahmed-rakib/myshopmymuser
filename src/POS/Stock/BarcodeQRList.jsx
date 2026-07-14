import React, {useState, useEffect, useCallback, useMemo} from 'react';
// import LoadingSpinner from './ProductList/LoadingSpinner';
import api from "../../context_or_provider/pos/posApi";
import LoadingSpinner from "../components/LoadingSpinner";
import UniversalSearchFilter from "../components/UniversalSearchFilter";

const BarcodeQRList = ({type}) => {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        supplier: '',
        brand: '',
        product: '',
        invoice: '',
        startDate: '',
        endDate: '',
        printStatus: 'all' // all, printed, not_printed
    });

    const filtersConfig = useMemo(() => [
        {
            key: "product",
            label: "Product",
            options: [
                { value: "all", label: "All Products" },
                ...products.map(p => ({ value: String(p.id), label: p.name }))
            ]
        },
        {
            key: "brand",
            label: "Brand",
            options: [
                { value: "all", label: "All Brands" },
                ...brands.map(b => ({ value: String(b.id), label: b.title }))
            ]
        },
        {
            key: "supplier",
            label: "Supplier",
            options: [
                { value: "all", label: "All Suppliers" },
                ...suppliers.map(s => ({ value: String(s.id), label: s.name }))
            ]
        },
        {
            key: "printStatus",
            label: "Print Status",
            options: [
                { value: "all", label: "All Items" },
                { value: "not_printed", label: "Not Printed Yet" },
                { value: "printed", label: "Already Printed" }
            ]
        }
    ], [products, brands, suppliers]);

    const advancedConfig = useMemo(() => [
        {
            key: "purchaseDateRange",
            type: "date-range",
            label: "Purchase Date Range"
        }
    ], []);

    const handleSearch = useCallback((query) => {
        setFilters(prev => ({ ...prev, search: query }));
    }, []);

    const handleFilter = useCallback((activeFilters) => {
        setFilters(prev => ({
            ...prev,
            product: activeFilters.product === "all" ? "" : (activeFilters.product || ""),
            brand: activeFilters.brand === "all" ? "" : (activeFilters.brand || ""),
            supplier: activeFilters.supplier === "all" ? "" : (activeFilters.supplier || ""),
            printStatus: activeFilters.printStatus || "all",
            startDate: activeFilters.purchaseDateRange?.from || "",
            endDate: activeFilters.purchaseDateRange?.to || ""
        }));
    }, []);

    useEffect(() => {
        fetchSuppliers();
        fetchBrands();
        fetchProducts();
        fetchInstances();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get("/api/purchase/suppliers/");
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await api.get("/api/products/brand/");
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get("/api/products/product/");
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchInstances = async () => {
        setLoading(true);
        try {
            const params = {};

            if (filters.search) params.search = filters.search;
            if (filters.supplier) params.supplier = filters.supplier;
            if (filters.brand) params.brand = filters.brand;
            if (filters.product) params.product = filters.product;
            if (filters.invoice) params.purchase_invoice_no = filters.invoice;
            if (filters.startDate) params.purchase_date_after = filters.startDate;
            if (filters.endDate) params.purchase_date_before = filters.endDate;

            if (filters.printStatus === 'printed') {
                params.is_printed = 'true';
            } else if (filters.printStatus === 'not_printed') {
                params.not_printed = 'true';
            }

            const response = await api.get("/api/bar-qr/instances/", { params });
            setInstances(response.data);
        } catch (error) {
            console.error('Error fetching instances:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search/filter
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchInstances();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };



    const handlePrint = async (instance) => {
        const printWindow = window.open('', '_blank');
        const imageUrl = type === 'barcode' ? instance.barcode : instance.qr_code;
        const title = type === 'barcode' ? 'Barcode' : 'QR Code';

        // Backticks (``) use kora hoyeche multiline HTML and variables-er jonno
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Print ${title}</title>
                <style>
                    body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }       
                    img { 
                        ${type === 'barcode' 
                            ? 'max-width: 350px; height: auto; max-height: 120px;' 
                            : 'width: 180px; height: 180px;'
                        } 
                        object-fit: contain; 
                        margin-bottom: 20px; 
                    }
                    .info { text-align: center; margin-bottom: 10px; }
                    .price { font-size: 1.2rem; font-weight: bold; }
                    @media print {
                        .no-print { display: none; }
                        body { height: auto; padding: 20px; justify-content: flex-start; }
                    }
                </style>
            </head>
            <body>
                <div class="info">
                    <div style="font-size: 1.2rem; font-weight: bold;">${instance.product_name || 'Product'}</div>
                    <div style="font-size: 0.9rem;">Serial: ${instance.unique_serial}</div>
                    <div class="price">Purchase Price: ৳ ${instance.purchase_price || '0.00'}</div>
                    <div class="price">Selling Price: ৳ ${instance.sale_price || '0.00'}</div>
                    <div class="brand-text">Brand:${instance.brand_name || '?brand'}</div> 
                    <div class="brand-text">Supplie-rname: ${instance.supplier_name || '?supplier'}</div> 
                </div>
                <img src="${imageUrl}" alt="${title}" />
                <div class="no-print" style="margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">    
                        Print Now
                    </button>
                </div>
            </body>
        </html>
    `);

        printWindow.document.close();

        // Backend update logic
        try {
            if (instance.id) {
                await api.post(`/api/bar-qr/instances/${instance.id}/increment_print_count/`);
            }
        } catch (e) {
            console.error("Print count update failed:", e);
        }
        };

    const handlePrintAll = () => {
        const printWindow = window.open('', '_blank');
        const title = type === 'barcode' ? 'Barcodes' : 'QR Codes';

        let itemsHtml = '';
        instances.forEach(instance => {
            const imageUrl = type === 'barcode' ? instance.barcode : instance.qr_code;
            itemsHtml += `
                <div style="border: 1px solid #ddd; padding: 10px; text-align: center; page-break-inside: avoid; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-weight: bold; font-size: 0.9rem; margin-bottom: 5px;">${instance.product_name}</div>
                    <div style="font-size: 0.7rem; color: #555;">S/N: ${instance.unique_serial}</div>
                    <div style="font-weight: bold; font-size: 0.8rem; margin-top: 5px;">৳ ${instance.sale_price || '0.00'}</div>
                    <img src="${imageUrl}" style="margin-top: 10px; object-fit: contain; ${type === 'barcode' ? 'max-width: 100%; height: auto; max-height: 80px;' : 'width: 120px; height: 120px;'}" alt="code" />
                </div>
            `;
        });

        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Print All ${title}</title>
                <style>
                    body { font-family: sans-serif; margin: 0; padding: 10px; }
                    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: center;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Print All Filtered Now
                    </button>
                </div>
                <div class="grid">${itemsHtml}</div>
            </body>
        </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">
                        Print {type === 'barcode' ? 'Product Barcodes' : 'Product QR Codes'}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold mt-1">Generate and print batch labels for product inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-black px-3 py-2 rounded-xl">
                        Total: {instances.length} items
                    </span>
                    <button 
                        onClick={handlePrintAll}
                        disabled={instances.length === 0}
                        className="px-4 py-2 bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/10 active:scale-95"
                    >
                        <span>🖨️</span> Print All Filtered
                    </button>
                </div>
            </div>

            <UniversalSearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                searchPlaceholder="Search product code, name, serial or invoice..."
                filtersConfig={filtersConfig}
                advancedConfig={advancedConfig}
                initialFilters={{
                    product: "all",
                    brand: "all",
                    supplier: "all",
                    printStatus: "all"
                }}
                className="mb-6"
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl shadow-sm">
                    <LoadingSpinner size="lg"/>
                    <p className="mt-4 text-gray-600">Searching records...</p>
                </div>
            ) : instances.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                    <button
                        onClick={() => setFilters({
                            search: '',
                            supplier: '',
                            brand: '',
                            product: '',
                            invoice: '',
                            startDate: '',
                            endDate: '',
                            printStatus: 'all'
                        })}
                        className="mt-4 text-blue-600 hover:underline font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 animate-in fade-in duration-300">
                    {instances.map((instance) => (
                        <div key={instance.id}
                             className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200 group flex flex-col justify-between">
                            <div>
                                <div className={`${type === 'barcode' ? 'aspect-[8/3]' : 'aspect-[4/3]'} flex items-center justify-center bg-gray-50 p-2 relative border-b border-gray-100`}>
                                    <img
                                        src={type === 'barcode' ? instance.barcode : instance.qr_code}
                                        alt={instance.product_name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    {instance.qr_printed_count > 0 && (
                                        <span
                                            className="absolute top-1.5 right-1.5 bg-green-100 text-green-800 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                            {instance.qr_printed_count}x
                                        </span>
                                    )}
                                </div>
                                <div className="p-2">
                                    <h3 className="font-bold text-[10px] text-gray-800 line-clamp-1 leading-tight mb-1" title={instance.product_name}>
                                        {instance.product_name}
                                    </h3>
                                    <div className="space-y-0.5 mb-2 text-[9px]">
                                        <p className="text-gray-500 flex justify-between items-center gap-1">
                                            <span className="font-bold uppercase tracking-wider text-[7px] text-gray-400">S/N:</span>
                                            <span
                                                className="font-mono text-gray-700 bg-gray-100 px-1 rounded text-[8px] select-all cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors truncate max-w-[85px]"
                                                title="Click to copy full serial"
                                                onClick={(e) => {
                                                    navigator.clipboard.writeText(instance.unique_serial);
                                                    e.stopPropagation();
                                                }}
                                            >
                                                {instance.unique_serial}
                                            </span>
                                        </p>
                                        <p className="text-gray-500 flex justify-between">
                                            <span className="font-bold uppercase tracking-wider text-[7px] text-gray-400">Inv:</span>
                                            <span className="text-gray-700 truncate max-w-[80px] font-medium" title={instance.purchase_invoice_no}>{instance.purchase_invoice_no || 'N/A'}</span>
                                        </p>
                                        <p className="text-gray-500 flex justify-between">
                                            <span className="font-bold uppercase tracking-wider text-[7px] text-gray-400">Date:</span>
                                            <span
                                                className="text-gray-700 font-medium">{instance.purchase_date ? new Date(instance.purchase_date).toLocaleDateString() : 'N/A'}</span>      
                                        </p>
                                        
                                        <div className="flex justify-between items-center text-[8px] font-bold text-gray-500 mt-1.5 border-t border-dashed border-gray-150 pt-1">
                                            <span>Cost: <span className="font-mono text-gray-700">৳{Number(instance.purchase_price).toFixed(0)}</span></span>
                                            <span>Sale: <span className="font-mono text-blue-600 font-extrabold">৳{Number(instance.sale_price).toFixed(0)}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 pt-0 mt-auto">
                                <button
                                    onClick={() => handlePrint(instance)}
                                    className="w-full py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center font-black text-[8px] uppercase tracking-wider shadow-sm active:scale-95"
                                >
                                    <span className="mr-1">🖨️</span> Print Label
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BarcodeQRList;

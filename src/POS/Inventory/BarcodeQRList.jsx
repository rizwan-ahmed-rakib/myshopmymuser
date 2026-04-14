import React, {useState, useEffect, useCallback} from 'react';
import LoadingSpinner from './ProductList/LoadingSpinner';
import BASE_URL_of_POS from "../../posConfig";

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

    useEffect(() => {
        fetchSuppliers();
        fetchBrands();
        fetchProducts();
        fetchInstances();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/purchase/suppliers/`);
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/products/brand/`);
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/products/product/`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchInstances = async () => {
        setLoading(true);
        try {
            let url = `${BASE_URL_of_POS}/api/bar-qr/instances/?`;
            const params = new URLSearchParams();

            if (filters.search) params.append('search', filters.search);
            if (filters.supplier) params.append('supplier', filters.supplier);
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.product) params.append('product', filters.product);
            if (filters.invoice) params.append('purchase_invoice_no', filters.invoice);
            if (filters.startDate) params.append('purchase_date_after', filters.startDate);
            if (filters.endDate) params.append('purchase_date_before', filters.endDate);

            if (filters.printStatus === 'printed') {
                params.append('is_printed', 'true');
            } else if (filters.printStatus === 'not_printed') {
                params.append('not_printed', 'true');
            }

            const response = await fetch(url + params.toString());
            const data = await response.json();
            setInstances(data);
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
                    img { max-width: 100%; height: auto; margin-bottom: 20px; }
                    .info { text-align: center; margin-bottom: 10px; }
                    .price { font-size: 1.2rem; font-weight: bold; }
                    @media print {
                        .no-print { display: none; }
                        body { height: auto; padding: 20px; }
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
                await fetch(`${BASE_URL_of_POS}/api/bar-qr/instances/${instance.id}/increment_print_count/`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });
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
                    <img src="${imageUrl}" style="max-width: 100%; height: auto; margin-top: 10px;" alt="code" />
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
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Print {type === 'barcode' ? 'Barcode' : 'QR Code'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handlePrintAll}
                            disabled={instances.length === 0}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center shadow-sm"
                        >
                            <span className="mr-2">🖨️</span> Print All Filtered
                        </button>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Total: {instances.length} items
                        </span>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="Name, Serial..."
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                        <select
                            name="product"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.product}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Products</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
                        <select
                            name="brand"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.brand}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Brands</option>
                            {brands.map(b => (
                                <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Supplier</label>
                        <select
                            name="supplier"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.supplier}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Suppliers</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Invoice No</label>
                        <input
                            type="text"
                            name="invoice"
                            placeholder="P-INV-..."
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.invoice}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Print Status</label>
                        <select
                            name="printStatus"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={filters.printStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All Items</option>
                            <option value="not_printed">Not Printed Yet</option>
                            <option value="printed">Already Printed</option>
                        </select>
                    </div>
                </div>
            </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {instances.map((instance) => (
                        <div key={instance.id}
                             className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="aspect-square flex items-center justify-center bg-gray-50 p-4 relative">
                                <img
                                    src={type === 'barcode' ? instance.barcode : instance.qr_code}
                                    alt={instance.product_name}
                                    className="max-h-full max-w-full object-contain"
                                />
                                {instance.qr_printed_count > 0 && (
                                    <span
                                        className="absolute top-2 right-2 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Printed {instance.qr_printed_count}x
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 truncate mb-1">{instance.product_name}</h3>
                                <div className="space-y-1 mb-4">
                                    <p className="text-xs text-gray-500 flex justify-between">
                                        <span>Serial:</span>
                                        <span
                                            className="font-mono text-gray-700">{instance.unique_serial.split('-')[0]}...</span>
                                    </p>
                                    <p className="text-xs text-gray-500 flex justify-between">
                                        <span>Invoice:</span>
                                        <span className="text-gray-700">{instance.purchase_invoice_no || 'N/A'}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 flex justify-between">
                                        <span>Supplier:</span>
                                        <span className="text-gray-700">{instance.supplier || 'N/A'}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 flex justify-between">
                                        <span>Date:</span>
                                        <span
                                            className="text-gray-700">{instance.purchase_date ? new Date(instance.purchase_date).toLocaleDateString() : 'N/A'}</span>      
                                    </p>
                                    <p className="text-sm font-bold text-blue-600 mt-2">
                                        purchase_price {instance.purchase_price}
                                    </p>
                                    <p className="text-sm font-bold text-blue-600 mt-2">
                                        selling_price {instance.sale_price}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handlePrint(instance)}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium shadow-sm active:transform active:scale-95"
                                >
                                    <span className="mr-2">🖨️</span> Print {type === 'barcode' ? 'Barcode' : 'QR Code'}
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

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, Calendar, Search, Filter, RefreshCw, 
  ChevronRight, Download, Package, MoreVertical, Trash2
} from 'lucide-react';
import { posSizeAPI as uniqueInstanceAPI } from '../../../context_or_provider/pos/UniqueProductInstance/unique_product_instanceApi';
import { posCategoryAPI } from '../../../context_or_provider/pos/categories/categoryAPI';
import { posSubCategoryAPI } from '../../../context_or_provider/pos/subcategories/subCategoryApi';
import { posBrandAPI } from '../../../context_or_provider/pos/brands/brandAPI';

const ExpiredProducts = () => {
  const [instances, setInstances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sub_category: 'all',
    brand: 'all',
    status: 'all' // all, expired, near_expiry
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [instancesRes, catRes, subCatRes, brandRes] = await Promise.all([
        uniqueInstanceAPI.getAll(),
        posCategoryAPI.getAll(),
        posSubCategoryAPI.getAll(),
        posBrandAPI.getAll()
      ]);
      
      // Filter only products that are in stock and are either expired or near expiry
      const inStockInstances = instancesRes.data.filter(item => 
        item.status === 'in_stock' && 
        (item.expiry_status === 'expired' || item.expiry_status === 'near_expiry')
      );
      
      setInstances(inStockInstances);
      setCategories(catRes.data);
      setAllSubCategories(subCatRes.data);
      setBrands(brandRes.data);
    } catch (error) {
      console.error("Error fetching expired products data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter subcategories based on selected category
  const availableSubCategories = useMemo(() => {
    if (filters.category === 'all') return [];
    return allSubCategories.filter(sub => String(sub.category) === String(filters.category));
  }, [filters.category, allSubCategories]);

  // Reset subcategory if category changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, sub_category: 'all' }));
  }, [filters.category]);

  const filteredInstances = useMemo(() => {
    return instances.filter(item => {
      const product = item.product || {};
      
      const matchesSearch = (product.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
                            (item.unique_serial || '').toLowerCase().includes(filters.search.toLowerCase()) ||
                            (item.batch_no || '').toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || String(product.category) === String(filters.category);
      const matchesSubCategory = filters.sub_category === 'all' || String(product.sub_category) === String(filters.sub_category);
      const matchesBrand = filters.brand === 'all' || String(product.brand) === String(filters.brand);
      const matchesStatus = filters.status === 'all' || item.expiry_status === filters.status;

      return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand && matchesStatus;
    });
  }, [instances, filters]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'near_expiry': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Expired & Near Expiry Products
          </h1>
          <p className="text-sm text-gray-500">Stock items that are expired or expiring soon.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Product, Serial, Batch..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
          </select>

          <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none" value={filters.sub_category} onChange={(e) => setFilters({...filters, sub_category: e.target.value})} disabled={filters.category === 'all'}>
            <option value="all">All Sub Categories</option>
            {availableSubCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.title}</option>)}
          </select>

          <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none" value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})}>
            <option value="all">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name || b.title}</option>)}
          </select>

          <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="all">All Status</option>
            <option value="expired">Expired</option>
            <option value="near_expiry">Near Expiry</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><RefreshCw className="animate-spin mx-auto text-blue-600 mb-2" size={40} /><p>Loading products...</p></div>
        ) : filteredInstances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 uppercase text-[11px] font-bold text-gray-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Batch & SN</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredInstances.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{item.product_name || item.product?.name}</p>
                      <p className="text-[10px] text-gray-400">Code: {item.product?.product_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">Batch: {item.batch_no || 'N/A'}</p>
                      <p className="text-[11px] text-gray-400 font-mono">SN: {item.unique_serial}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p>Mfg: {item.manufacturing_date || 'N/A'}</p>
                      <p className="font-bold text-red-600">Exp: {item.expiry_date || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(item.expiry_status)}`}>
                        {item.expiry_status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600"><ChevronRight size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center"><Package className="mx-auto text-gray-200 mb-4" size={60} /><h3 className="text-lg font-bold">No products found</h3><p className="text-gray-400">Try adjusting your filters.</p></div>
        )}
      </div>
    </div>
  );
};

export default ExpiredProducts;

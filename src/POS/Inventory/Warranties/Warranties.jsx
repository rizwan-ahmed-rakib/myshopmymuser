import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Calendar, Search, Filter, RefreshCw, 
  ChevronRight, Download, Package, User, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { posSizeAPI as uniqueInstanceAPI } from '../../../context_or_provider/pos/UniqueProductInstance/unique_product_instanceApi';
import { posCategoryAPI } from '../../../context_or_provider/pos/categories/categoryAPI';
import { posSubCategoryAPI } from '../../../context_or_provider/pos/subcategories/subCategoryApi';
import { posBrandAPI } from '../../../context_or_provider/pos/brands/brandAPI';

const Warranties = () => {
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
    status: 'all' // all, active, expired
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
      
      // Filter sold products that have warranty
      const warrantyInstances = instancesRes.data.filter(item => 
        item.has_warranty === true && item.status === 'sold'
      );
      
      setInstances(warrantyInstances);
      setCategories(catRes.data);
      setAllSubCategories(subCatRes.data);
      setBrands(brandRes.data);
    } catch (error) {
      console.error("Error fetching warranties data:", error);
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
      const customer = item.customer || {};
      
      const matchesSearch = (product.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
                            (item.unique_serial || '').toLowerCase().includes(filters.search.toLowerCase()) ||
                            (customer.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
                            (item.sale_invoice_no || '').toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || String(product.category) === String(filters.category);
      const matchesSubCategory = filters.sub_category === 'all' || String(product.sub_category) === String(filters.sub_category);
      const matchesBrand = filters.brand === 'all' || String(product.brand) === String(filters.brand);
      const matchesStatus = filters.status === 'all' || item.warranty_status === filters.status;

      return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand && matchesStatus;
    });
  }, [instances, filters]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-blue-600" /> Warranty Management
          </h1>
          <p className="text-sm text-gray-500">Track warranties for products sold to customers.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Records
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative col-span-1 md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Product, SN, Customer, Inv..."
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
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><RefreshCw className="animate-spin mx-auto text-blue-600 mb-2" size={40} /><p>Loading warranties...</p></div>
        ) : filteredInstances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 uppercase text-[11px] font-bold text-gray-500">
                  <th className="px-6 py-4">Product & Serial</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Sale Details</th>
                  <th className="px-6 py-4">Warranty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredInstances.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{item.product_name || item.product?.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">SN: {item.unique_serial}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{item.customer?.name || 'Walk-in'}</p>
                      <p className="text-[11px] text-gray-400">{item.customer?.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold">Inv: {item.sale_invoice_no}</p>
                      <p className="text-gray-400">{item.sale_date?.split('T')[0]}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium">{item.warranty_period_name}</p>
                      <p className="text-red-500 font-bold">Ends: {item.warranty_end_date?.split('T')[0]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(item.warranty_status)}`}>
                        {item.warranty_status.toUpperCase()}
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
          <div className="p-20 text-center"><Shield className="mx-auto text-gray-200 mb-4" size={60} /><h3 className="text-lg font-bold">No records found</h3><p className="text-gray-400">No sold products with warranty found.</p></div>
        )}
      </div>
    </div>
  );
};

export default Warranties;

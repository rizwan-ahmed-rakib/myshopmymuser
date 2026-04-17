import React from 'react';
import { 
  BarChart3, Package, Wallet, Users, ArrowUpRight, ArrowDownRight, 
  ShoppingCart, ShoppingBag, FileText, Banknote, History, 
  ArrowRightLeft, Truck, TrendingUp
} from 'lucide-react';

const Reports = () => {
  
  // ১. কুইক স্ট্যাট কার্ড (এক নজরে আজকের অবস্থা)
  const stats = [
    { title: "Today's Sales", value: "৳ 25,450", icon: <ArrowUpRight className="text-green-500" />, trend: "+12%", bg: "bg-green-50" },
    { title: "Today's Purchase", value: "৳ 18,200", icon: <ShoppingBag className="text-orange-500" />, trend: "+5%", bg: "bg-orange-50" },
    { title: "Today's Expense", value: "৳ 4,200", icon: <ArrowDownRight className="text-red-500" />, trend: "-2%", bg: "bg-red-50" },
    { title: "Cash in Hand", value: "৳ 1,12,000", icon: <Wallet className="text-blue-500" />, trend: "Stable", bg: "bg-blue-50" },
  ];

  // ২. রিপোর্ট ক্যাটাগরি এবং তাদের আন্ডারে থাকা রিপোর্ট লিস্ট
  const reportGroups = [
    {
      group: "Sales Reports",
      icon: <ShoppingCart className="text-blue-600" />,
      color: "border-blue-500",
      items: [
        { name: "Daily Sales", desc: "প্রতিদিনের বিক্রয় রিপোর্ট" },
        { name: "Sales Return", desc: "বিক্রয় ফেরতের হিসাব" },
        { name: "Product-wise Sales", desc: "পণ্য অনুযায়ী বিক্রয়" },
        { name: "Profit & Loss", desc: "লাভ-ক্ষতির বিস্তারিত" },
      ]
    },
    {
      group: "Purchase Reports",
      icon: <Truck className="text-orange-600" />,
      color: "border-orange-500",
      items: [
        { name: "Purchase History", desc: "কেনাকাটার বিস্তারিত তথ্য" },
        { name: "Supplier Returns", desc: "সাপ্লায়ারকে ফেরত পাঠানো পণ্য" },
        { name: "Pending Payments", desc: "বাকি কেনাকাটার হিসাব" },
        { name: "Purchase Tax/VAT", desc: "কেনাকাটায় ভ্যাট রিপোর্ট" },
      ]
    },
    {
      group: "Inventory & Stock",
      icon: <Package className="text-indigo-600" />,
      color: "border-indigo-500",
      items: [
        { name: "Current Stock", desc: "স্টকের বর্তমান অবস্থা" },
        { name: "Low Stock Alert", desc: "কম স্টকের পণ্যের তালিকা" },
        { name: "Stock Adjustment", desc: "স্টক কমানো/বাড়ানোর হিস্ট্রি" },
        { name: "Damaged Stock", desc: "নষ্ট পণ্যের বিস্তারিত" },
      ]
    },
    {
      group: "Finance & Cashbox",
      icon: <Banknote className="text-emerald-600" />,
      color: "border-emerald-500",
      items: [
        { name: "Cashbox Statement", desc: "ক্যাশ লেনদেনের ইতিহাস" },
        { name: "Income Report", desc: "অন্যান্য আয়ের হিসাব" },
        { name: "Expense Report", desc: "ব্যবসায়িক খরচের রিপোর্ট" },
        { name: "Bank Transaction", desc: "ব্যাংক লেনদেনের হিসাব" },
      ]
    },
    {
      group: "HRM & Payroll",
      icon: <Users className="text-purple-600" />,
      color: "border-purple-500",
      items: [
        { name: "Attendance Report", desc: "হাজিরা ও কর্মঘণ্টা" },
        { name: "Salary Sheet", desc: "মাসিক বেতন রিপোর্ট" },
        { name: "Employee Loan", desc: "লোন ও অগ্রিম বেতন" },
        { name: "Bonus & Incentives", desc: "বোনাস ও ইনসেনটিভ" },
      ]
    },
    {
      group: "Customer & Supplier",
      icon: <ArrowRightLeft className="text-rose-600" />,
      color: "border-rose-500",
      items: [
        { name: "Customer Ledger", desc: "কাস্টমার অনুযায়ী বাকি-বকেয়া" },
        { name: "Supplier Ledger", desc: "সাপ্লায়ার অনুযায়ী বাকি-বকেয়া" },
        { name: "Top Customers", desc: "সবচেয়ে বেশি কেনা কাস্টমার" },
        { name: "Parties Balance", desc: "উভয় পার্টির মোট ব্যালেন্স" },
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={32} />
            Business Intelligence Reports
          </h1>
          <p className="text-gray-500 mt-1">Comprehensive analysis of your POS operations</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-all">
                <History size={16} /> Audit Logs
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all">
                <FileText size={16} /> Export All
            </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className={`p-3 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>{stat.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-100 text-green-700' : stat.trend === 'Stable' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.title}</h3>
            <p className="text-xl md:text-2xl font-black text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Report Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {reportGroups.map((group, i) => (
          <div key={i} className={`bg-white rounded-2xl shadow-sm border-t-4 ${group.color} border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all`}>
            <div className="px-6 py-4 bg-gray-50/50 border-b flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">{group.icon}</div>
              <h2 className="text-lg font-bold text-gray-800">{group.group}</h2>
            </div>
            <div className="p-3 grid grid-cols-1 gap-2 flex-1">
              {group.items.map((report, j) => (
                <button 
                  key={j} 
                  className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all text-left group/btn"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 group-hover/btn:text-blue-600 transition-colors">{report.name}</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">{report.desc}</span>
                  </div>
                  <ArrowRightLeft size={14} className="text-gray-300 opacity-0 group-hover/btn:opacity-100 transition-all transform translate-x-[-10px] group-hover/btn:translate-x-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;

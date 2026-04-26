
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, Package, Wallet, ArrowRight, BarChart2 } from 'lucide-react';

const categories = [
  {
    id: 'sales',
    title: 'Sales Reports',
    icon: ShoppingCart,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    desc: 'Daily, Product-wise, Customer-wise, Returns',
    stats: 'Sales & Revenue',
  },
  {
    id: 'purchase',
    title: 'Purchase Reports',
    icon: Truck,
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    desc: 'History, Supplier-wise, Returns, Pending Payments',
    stats: 'Purchase & Suppliers',
  },
  {
    id: 'inventory',
    title: 'Inventory & Stock',
    icon: Package,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    desc: 'Current Stock, Low Stock, Damage, Stock Value',
    stats: 'Stock & Products',
  },
  {
    id: 'financial',
    title: 'Financial Reports',
    icon: Wallet,
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    desc: 'Cash in Hand, Income, Expense, Profit & Loss',
    stats: 'Finance & Cashflow',
  },
];

const ReportsList = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: '#1e293b',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BarChart2 size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Reports Dashboard</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Select a category to view detailed reports</p>
          </div>
        </div>

        <div style={{ height: 1, background: '#e2e8f0', margin: '24px 0' }} />

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 16
        }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate('/reports/detail', { state: { reportCategory: cat.id } })}
                style={{
                  background: 'white',
                  borderRadius: 14,
                  border: `1px solid ${cat.border}`,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 4px 20px ${cat.color}22`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = cat.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = cat.border;
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: cat.color, borderRadius: '14px 14px 0 0'
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 4 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} color={cat.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{cat.title}</h2>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{cat.desc}</p>
                  </div>
                  <ArrowRight size={18} color={cat.color} style={{ flexShrink: 0, marginTop: 4 }} />
                </div>

                <div style={{
                  marginTop: 16, paddingTop: 12,
                  borderTop: `1px solid ${cat.border}`,
                  fontSize: 12, color: cat.color, fontWeight: 500
                }}>
                  {cat.stats} →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
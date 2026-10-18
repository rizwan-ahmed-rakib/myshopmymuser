import React from 'react';
import { Users, Truck, ShoppingBag, ShoppingCart, ArrowRight } from 'lucide-react';
import { Card, Skeleton } from './Shared';
import { useNavigate } from 'react-router-dom';

const EntityKPICard = ({ title, total, breakdown, icon: Icon, color = '#6366f1', onClick, subtitle }) => (
    <Card
        onClick={onClick}
        style={{
            position: 'relative',
            overflow: 'hidden',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
        }}
        className="hover:shadow-md hover:-translate-y-0.5"
    >
        <div style={{
            position: 'absolute', top: 0, left: 0,
            width: 3, height: '100%', background: color,
        }} />
        <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 8,
        }}>
            <span style={{
                fontSize: 11, fontWeight: 800, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{title}</span>
            <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={16} color={color} />
            </div>
        </div>

        <div style={{
            fontSize: 24, fontWeight: 900, color: '#0f172a',
            letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>
            {Number(total || 0).toLocaleString('en-BD')}
        </div>

        {breakdown ? (
            <div style={{
                marginTop: 8, display: 'flex', flexWrap: 'wrap',
                gap: 5, fontSize: 10.5,
            }}>
                {breakdown.map((item, idx) => (
                    <span
                        key={idx}
                        style={{
                            background: item.bg || '#f1f5f9',
                            color: item.color || '#475569',
                            padding: '2px 7px',
                            borderRadius: 6,
                            fontWeight: 700,
                        }}
                    >
                        {item.label}: {item.value}
                    </span>
                ))}
            </div>
        ) : (
            <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                {subtitle || '—'}
            </div>
        )}
    </Card>
);

const DashboardEntityKPIs = ({ loading, kpiOverview }) => {
    const navigate = useNavigate();

    if (loading || !kpiOverview) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 12,
            }}>
                {[...Array(4)].map((_, i) => (
                    <Card key={i}><Skeleton h={84} /></Card>
                ))}
            </div>
        );
    }

    const {
        total_customers = 0,
        total_registered_customers = 0,
        total_walk_in_customers = 0,
        total_suppliers = 0,
        total_brands = 0,
        total_purchase_invoices = 0,
        total_sale_invoices = 0,
        sale_invoices_registered = 0,
        sale_invoices_walkin = 0,
    } = kpiOverview;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
        }}>
            <EntityKPICard
                title="Total Customers"
                total={total_customers}
                color="#0ea5e9"
                icon={Users}
                onClick={() => navigate('/sales')}
                breakdown={[
                    { label: 'Registered', value: total_registered_customers, bg: '#e0f2fe', color: '#0284c7' },
                    { label: 'Walk-in', value: total_walk_in_customers, bg: '#fef3c7', color: '#d97706' },
                ]}
            />

            <EntityKPICard
                title="Total Suppliers"
                total={total_suppliers}
                color="#f59e0b"
                icon={Truck}
                onClick={() => navigate('/purchase')}
                subtitle={`${total_brands} Brands Procured`}
            />

            <EntityKPICard
                title="Purchase Invoices"
                total={total_purchase_invoices}
                color="#8b5cf6"
                icon={ShoppingBag}
                onClick={() => navigate('/purchase')}
                subtitle="Total procurement bills"
            />

            <EntityKPICard
                title="Sale Invoices"
                total={total_sale_invoices}
                color="#10b981"
                icon={ShoppingCart}
                onClick={() => navigate('/sales')}
                breakdown={[
                    { label: 'Registered', value: sale_invoices_registered, bg: '#ecfdf5', color: '#059669' },
                    { label: 'Walk-in', value: sale_invoices_walkin, bg: '#fef3c7', color: '#b45309' },
                ]}
            />
        </div>
    );
};

export default DashboardEntityKPIs;

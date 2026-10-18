// src/POS/Dashboard/components/KPIGrid.jsx
import React from 'react';
import {
    TrendingUp, DollarSign, Truck, Wallet, Users, Boxes,
    ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {Card, Skeleton} from './Shared';
import {fmtCurrency, fmtNumber, fmtPct} from '../utils/dashboardUtils';

const KPICard = ({
                     label, value, trend, icon: Icon,
                     color = '#6366f1', subtitle, isMoney = true,
                 }) => {
    const isUp = trend === null || trend === undefined || parseFloat(trend) >= 0;
    const showTrend = trend !== null && trend !== undefined && isFinite(trend);

    return (
        <Card style={{position: 'relative', overflow: 'hidden'}}>
            <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 3, height: '100%', background: color,
            }}/>
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 8,
            }}>
                <span style={{
                    fontSize: 10.5, fontWeight: 800, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{label}</span>
                <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={14} color={color}/>
                </div>
            </div>
            <div style={{
                fontSize: 22, fontWeight: 800, color: '#0f172a',
                letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
                {isMoney ? fmtCurrency(value) : fmtNumber(value)}
            </div>
            <div style={{
                marginTop: 6, display: 'flex',
                alignItems: 'center', gap: 5, fontSize: 11.5,
            }}>
                {showTrend ? (
                    <>
                        {isUp
                            ? <ArrowUpRight size={12} color="#10b981"/>
                            : <ArrowDownRight size={12} color="#ef4444"/>}
                        <span style={{
                            color: isUp ? '#10b981' : '#ef4444',
                            fontWeight: 700,
                        }}>{fmtPct(trend)}</span>
                        <span style={{color: '#94a3b8'}}>vs prev</span>
                    </>
                ) : (
                    <span style={{color: '#94a3b8'}}>{subtitle || '—'}</span>
                )}
            </div>
        </Card>
    );
};

const KPIGrid = ({loading, kpi,balances }) => {
    if (loading) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
            }}>
                {[...Array(6)].map((_, i) => (
                    <Card key={i}><Skeleton h={80}/></Card>
                ))}
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
        }}>
            <KPICard
                label="Sales" value={kpi.sales.value} trend={kpi.sales.trend}
                icon={TrendingUp} color="#6366f1"
            />
            <KPICard
                label="Net Profit" value={kpi.profit.value} trend={kpi.profit.trend}
                icon={DollarSign}
                color={kpi.profit.value >= 0 ? '#10b981' : '#ef4444'}
            />
            <KPICard
                label="Purchase" value={kpi.purchase.value} trend={kpi.purchase.trend}
                icon={Truck} color="#f59e0b"
            />
            <KPICard
                label="Cash in Hand" value={kpi.cash.value} trend={null}
                icon={Wallet} color="#8b5cf6" subtitle="Live balance"
            />

            {/* 👇 এখানে replace */}
            {/*<CashKPICard loading={loading} balances={balances}/>*/}

            <KPICard
                label="Customer Due" value={kpi.due.value} trend={kpi.due.trend}
                icon={Users} color="#ef4444"
            />
            <KPICard
                label="Stock Value" value={kpi.inventory.value} trend={null}
                icon={Boxes} color="#0ea5e9" subtitle="Purchase value"
            />
        </div>
    );
};


// const CashKPICard = ({loading, balances}) => {
//     const fc = (n) => `৳${parseFloat(n || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
//
//     if (loading) return <Card><Skeleton h={80}/></Card>;
//
//     const bal = balances || {};
//     const mobile = bal.mobile || {};
//
//     return (
//         <Card style={{position: 'relative', overflow: 'hidden'}}>
//             <div style={{
//                 position: 'absolute', top: 0, left: 0,
//                 width: 3, height: '100%', background: '#8b5cf6',
//             }}/>
//             <div style={{
//                 display: 'flex', justifyContent: 'space-between',
//                 alignItems: 'flex-start', marginBottom: 8,
//             }}>
//                 <span style={{
//                     fontSize: 10.5, fontWeight: 800, color: '#94a3b8',
//                     textTransform: 'uppercase', letterSpacing: '0.06em',
//                 }}>Cash in Hand</span>
//                 <div style={{
//                     width: 30, height: 30, borderRadius: 8,
//                     background: '#8b5cf615',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>
//                     <Wallet size={14} color="#8b5cf6"/>
//                 </div>
//             </div>
//
//             <div style={{
//                 fontSize: 22, fontWeight: 800, color: '#0f172a',
//                 letterSpacing: '-0.02em', lineHeight: 1.1,
//             }}>
//                 {fc(bal.grand_total)}
//             </div>
//
//             {/* Breakdown */}
//             <div style={{
//                 marginTop: 8, display: 'flex', flexWrap: 'wrap',
//                 gap: 4, fontSize: 10,
//             }}>
//                 <span style={{
//                     background: '#ecfdf5', color: '#059669',
//                     padding: '2px 6px', borderRadius: 5, fontWeight: 700,
//                 }}>💵 {fc(bal.cash)}</span>
//                 <span style={{
//                     background: '#eff6ff', color: '#2563eb',
//                     padding: '2px 6px', borderRadius: 5, fontWeight: 700,
//                 }}>🏛️ {fc(bal.bank)}</span>
//                 <span style={{
//                     background: '#faf5ff', color: '#9333ea',
//                     padding: '2px 6px', borderRadius: 5, fontWeight: 700,
//                 }}>📱 {fc(bal.total_mobile)}</span>
//             </div>
//         </Card>
//     );
// };

export default KPIGrid;
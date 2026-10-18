// src/POS/Dashboard/Dashboard.jsx
import React, {useState, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    RefreshCw, ShoppingCart, Truck, BarChart3, Wallet,
} from 'lucide-react';
import StarProducts from './components/StarProducts';
import ProductIntelligence from './components/ProductIntelligence';


import {useDashboardData} from './hooks/useDashboardData';
import AlertsBanner from './components/AlertsBanner';
import KPIGrid from './components/KPIGrid';
import DashboardEntityKPIs from './components/DashboardEntityKPIs';
import HealthScore from './components/HealthScore';
import InsightsPanel from './components/InsightsPanel';
import GoalTracker from './components/GoalTracker';
import {TrendChart, TopProductsChart} from './components/Charts';
import {
    StockAlerts, CustomerDues, SuppliersCard, RecentNotes,
} from './components/Intelligence';
import ActivityFeed from './components/ActivityFeed';
import TopPartnersCard from './components/TopPartnersCard';
import TopPartners from "./components/TopPartners";


const PERIODS = [
    {key: 'today', label: 'Today'},
    {key: 'week', label: 'This Week'},
    {key: 'month', label: 'This Month'},
    {key: 'year', label: 'This Year'},
    {key: 'all', label: 'All Time'},
];

// ═══════════════════════════════════════════════════════════════════
const QuickActions = ({onNavigate}) => {
    const actions = [
        {label: 'New Sale', icon: ShoppingCart, color: '#6366f1', path: '/pos-sale'},
        {label: 'New Purchase', icon: Truck, color: '#f59e0b', path: '/pos-purchase'},
        {label: 'Reports', icon: BarChart3, color: '#10b981', path: '/reports'},
        {label: 'Cashbox', icon: Wallet, color: '#8b5cf6', path: '/cashbox'},
    ];

    return (
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            {actions.map((a) => {
                const Icon = a.icon;
                return (
                    <button
                        key={a.label}
                        onClick={() => onNavigate(a.path)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 14px',
                            background: 'white',
                            border: `1px solid ${a.color}30`,
                            borderRadius: 10,
                            fontSize: 12, fontWeight: 700,
                            color: a.color,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${a.color}10`;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Icon size={13}/>
                        {a.label}
                    </button>
                );
            })}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
const Dashboard = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('today');

    const {
        data,
        loading,
        refreshing,
        refresh,
        health,
        insights,
        goal,
    } = useDashboardData(period);

    // KPI computation
    const kpi = useMemo(() => {
        const agg = data.profit?.aggregated || {};
        const cmp = data.profit?.comparison?.changes_pct || {};
        const bal = data.balances || {};   // 👈 cashbox balances
        return {
            sales: {value: agg.total_revenue || 0, trend: cmp.total_revenue},
            profit: {
                value: agg.accrual_total_net_profit_with_damage_loss
                    || agg.accrual_total_net_profit || 0,
                trend: cmp.accrual_total_net_profit_with_damage_loss
                    ?? cmp.accrual_total_net_profit,
            },
            purchase: {value: agg.total_purchase_value || 0, trend: cmp.total_purchase_value},
            // 👇 FIX: cashbox API থেকে নিন, growth থেকে না
            cash: {value: bal.grand_total || 0, trend: null},
            due: {value: agg.net_sale_value_dues || 0, trend: cmp.net_sale_value_dues},
            inventory: {value: data.inventory?.total_present_inventory_purchase_value || 0, trend: null},
        };
    }, [data]);

    // Alert items for banner
    const alertItems = useMemo(() => {
        const arr = [];
        if (data.alerts.outOfStock.length > 0) {
            arr.push({
                icon: '🚨',
                text: `${data.alerts.outOfStock.length}টি পণ্য স্টক শেষ`,
                action: '/inventory',
            });
        }
        if (data.alerts.lowStock.length > 0) {
            arr.push({
                icon: '⚠️',
                text: `${data.alerts.lowStock.length}টি কম স্টকে`,
                action: '/inventory',
            });
        }
        if (data.alerts.dueCustomers.length > 0) {
            arr.push({
                icon: '💰',
                text: `${data.alerts.dueCustomers.length} কাস্টমারের বাকি`,
                action: '/sales',
            });
        }
        return arr;
    }, [data.alerts]);

    const today = new Date();
    const hour = today.getHours();
    const greeting = hour < 12 ? 'Good Morning'
        : hour < 17 ? 'Good Afternoon'
            : 'Good Evening';
    const dateStr = today.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            paddingBottom: 40,
            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
        }}>
            <style>{`
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                .dash-fade { animation: fadeUp .4s ease both; }
                @keyframes spin { to { transform: rotate(360deg) } }
                .animate-spin { animation: spin .8s linear infinite }
            `}</style>

            <div style={{maxWidth: 1400, margin: '0 auto', padding: '24px 20px'}}>

                {/* ═══ HEADER ═══ */}
                <div className="dash-fade" style={{
                    display: 'flex', flexWrap: 'wrap', gap: 12,
                    alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 20,
                }}>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 22, fontWeight: 800,
                            color: '#0f172a', letterSpacing: '-0.02em',
                        }}>
                            {greeting}, Boss 👋
                        </h1>
                        <p style={{margin: '4px 0 0', fontSize: 13, color: '#64748b'}}>
                            {dateStr} · আপনার ব্যবসার এক নজরে
                        </p>
                    </div>
                    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        <QuickActions onNavigate={navigate}/>
                        <button
                            onClick={refresh}
                            disabled={refreshing}
                            title="Refresh"
                            style={{
                                padding: 9, borderRadius: 10,
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <RefreshCw
                                size={14} color="#64748b"
                                className={refreshing ? 'animate-spin' : ''}
                            />
                        </button>
                    </div>
                </div>

                {/* ═══ ALERTS ═══ */}
                {!loading && alertItems.length > 0 && (
                    <div className="dash-fade" style={{marginBottom: 16}}>
                        <AlertsBanner items={alertItems} onNavigate={navigate}/>
                    </div>
                )}

                {/* ═══ PERIOD SWITCHER ═══ */}
                <div className="dash-fade" style={{
                    display: 'inline-flex', gap: 2,
                    background: 'white', borderRadius: 10,
                    padding: 4, border: '1px solid #eef2f7',
                    marginBottom: 16,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}>
                    {PERIODS.map((p) => {
                        const isActive = period === p.key;
                        return (
                            <button
                                key={p.key}
                                onClick={() => setPeriod(p.key)}
                                style={{
                                    padding: '6px 14px', borderRadius: 7, border: 'none',
                                    background: isActive ? '#0ea5e9' : 'transparent',
                                    color: isActive ? 'white' : '#64748b',
                                    fontSize: 12, fontWeight: 700,
                                    cursor: 'pointer', transition: 'all 0.15s',
                                }}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>

                {/* ═══ KPI GRID ═══ */}
                <div className="dash-fade" style={{marginBottom: 16}}>
                    <KPIGrid loading={loading} kpi={kpi}/>
                    {/*<KPIGrid loading={loading} kpi={kpi} balances={data.balances}/>*/}
                </div>

                {/* ═══ 🆕 ENTITY OVERVIEW (CUSTOMERS, SUPPLIERS, INVOICES) ═══ */}
                <div className="dash-fade" style={{marginBottom: 16}}>
                    <DashboardEntityKPIs loading={loading} kpiOverview={data.kpiOverview}/>
                </div>

                {/* ═══ HEALTH + INSIGHTS + GOAL ═══ */}
                <div className="dash-fade" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 12, marginBottom: 16,
                }}>
                    <HealthScore loading={loading} health={health}/>
                    <InsightsPanel loading={loading} insights={insights} onNavigate={navigate}/>
                    <GoalTracker loading={loading} goal={goal} onGoalChange={refresh}/>
                </div>

                {/*/!* ═══ CHARTS ═══ *!/*/}
                {/*<div className="dash-fade" style={{*/}
                {/*    display: 'grid',*/}
                {/*    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',*/}
                {/*    gap: 12, marginBottom: 16,*/}
                {/*}}>*/}
                {/*    <TrendChart loading={loading} profit={data.profit}/>*/}
                {/*    <TopProductsChart loading={loading} topProducts={data.topProducts}/>*/}
                {/*</div>*/}

                {/*/! * ═══ INTELLIGENCE (4 columns) ═══ *!/*/}
                {/*/!*<div className="dash-fade" style={{*!/*/}
                {/*/!*    display: 'grid',*!/*/}
                {/*/!*    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',*!/*/}
                {/*/!*    gap: 12, marginBottom: 16,*!/*/}
                {/*/!*}}>*!/*/}
                {/*/!*    <StockAlerts loading={loading} data={data.alerts} onNavigate={navigate} />*!/*/}
                {/*/!*    <CustomerDues loading={loading} customers={data.alerts.dueCustomers} onNavigate={navigate} />*!/*/}
                {/*/!*    <SuppliersCard loading={loading} suppliers={data.supportData.suppliers} />*!/*/}
                {/*/!*    <RecentNotes loading={loading} notes={data.recentNotes} onNavigate={navigate} />*!/*/}
                {/*/!*</div>*!/*/}

                {/*/!* ═══ STAR PRODUCTS + RECENT NOTES ═══ *!/*/}
                {/*<div className="dash-fade" style={{*/}
                {/*    display: 'grid',*/}
                {/*    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',*/}
                {/*    gap: 12, marginBottom: 16,*/}
                {/*}}>*/}
                {/*    <StarProducts*/}
                {/*        loading={loading}*/}
                {/*        products={data.starProducts}*/}
                {/*        onNavigate={navigate}*/}
                {/*    />*/}
                {/*    <RecentNotes*/}
                {/*        loading={loading}*/}
                {/*        notes={data.recentNotes}*/}
                {/*        onNavigate={navigate}*/}
                {/*    />*/}
                {/*</div>*/}

                {/*/!* ═══ INTELLIGENCE (4 columns — এখন RecentNotes বাদ) ═══ *!/*/}
                {/*<div className="dash-fade" style={{*/}
                {/*    display: 'grid',*/}
                {/*    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',*/}
                {/*    gap: 12, marginBottom: 16,*/}
                {/*}}>*/}
                {/*    <StockAlerts loading={loading} data={data.alerts} onNavigate={navigate}/>*/}
                {/*    <CustomerDues loading={loading} customers={data.alerts.dueCustomers} onNavigate={navigate}/>*/}
                {/*    <SuppliersCard loading={loading} suppliers={data.supportData.suppliers}/>*/}
                {/*</div>*/}

                {/*/!* ═══ ACTIVITY FEED ═══ *!/*/}
                {/*<div className="dash-fade">*/}
                {/*    <ActivityFeed loading={loading} activity={data.activity} onNavigate={navigate}/>*/}
                {/*</div>*/}


                {/* ═══ TREND CHART (single) ═══ */}
                <div className="dash-fade" style={{marginBottom: 16}}>
                    <TrendChart loading={loading} profit={data.profit}/>
                </div>

                {/* ═══ PRODUCT INTELLIGENCE — Dedicated Row ═══ */}
                <div className="dash-fade" style={{marginBottom: 16}}>
                    <ProductIntelligence
                        loading={loading}
                        data={data}
                        onNavigate={navigate}
                    />
                </div>

                {/* ═══ INTELLIGENCE (4 columns) ═══ */}
                <div className="dash-fade" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 12, marginBottom: 16,
                }}>
                    <StockAlerts loading={loading} data={data.alerts} onNavigate={navigate}/>
                    <CustomerDues loading={loading} customers={data.alerts.dueCustomers} onNavigate={navigate}/>
                    <SuppliersCard loading={loading} suppliers={data.supportData.suppliers}/>
                    <RecentNotes loading={loading} notes={data.recentNotes} onNavigate={navigate}/>
                </div>

                {/* ═══ TOP PARTNERS (Customer + Supplier) ═══ */}
                <div className="dash-fade" style={{marginBottom: 16}}>
                    <TopPartners
                        onNavigate={navigate}
                        period={period}
                    />
                </div>

                {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">*/}
                {/*    <TopPartnersCard type="customer" limit={5}/>*/}
                {/*    <TopPartnersCard type="supplier" limit={5}/>*/}
                {/*</div>*/}

                {/* ═══ ACTIVITY FEED ═══ */}
                <div className="dash-fade">
                    <ActivityFeed loading={loading} activity={data.activity} onNavigate={navigate}/>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
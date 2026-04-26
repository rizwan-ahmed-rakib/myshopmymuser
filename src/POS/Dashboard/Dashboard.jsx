import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package,
  Truck, AlertTriangle, DollarSign, RefreshCw,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle,
} from 'lucide-react';

// ─── API ──────────────────────────────────────────────────────────────────────
const BASE = 'https://pos.myshopmym.com/api';
const EP = {
  sales:     `${BASE}/sale/sales/`,
  purchases: `${BASE}/purchase/purchases/`,
  products:  `${BASE}/products/product/`,
  expenses:  `${BASE}/cashbox/expenses/`,
  incomes:   `${BASE}/cashbox/income/`,
  customers: `${BASE}/sale/customers/`,
};

const apiFetch = async (url) => {
  try {
    const r = await fetch(url);
    const j = await r.json();
    return Array.isArray(j) ? j : j.results || [];
  } catch { return []; }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const toDate   = (s) => s ? s.split('T')[0] : '';
const toMonth  = (s) => s ? s.slice(0, 7) : '';
const currency = (n) => `৳${parseFloat(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0 })}`;
const pct      = (a, b) => b === 0 ? 0 : (((a - b) / b) * 100).toFixed(1);

const today      = new Date();
const todayStr   = today.toISOString().split('T')[0];
const thisMonth  = todayStr.slice(0, 7);
const lastMonth  = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().slice(0, 7);

// ─── REUSABLE UI COMPONENTS ───────────────────────────────────────────────────

/** Animated counter card */
const KPICard = ({ label, value, sub, icon: Icon, color, trend, trendVal }) => {
  const up = parseFloat(trendVal) >= 0;
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '20px 22px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* accent stripe */}
      <div style={{ position:'absolute', top:0, left:0, width:4, height:'100%', background:color, borderRadius:'16px 0 0 16px' }}/>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <p style={{ margin:0, fontSize:12, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
        <div style={{ width:36, height:36, borderRadius:10, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={17} color={color} />
        </div>
      </div>

      <p style={{ margin:0, fontSize:26, fontWeight:800, color:'#111827', letterSpacing:'-0.5px' }}>{value}</p>

      {sub && <p style={{ margin:0, fontSize:12, color:'#6b7280' }}>{sub}</p>}

      {trendVal !== undefined && (
        <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
          {up ? <ArrowUpRight size={14} color="#10b981"/> : <ArrowDownRight size={14} color="#ef4444"/>}
          <span style={{ fontSize:12, fontWeight:600, color: up?'#10b981':'#ef4444' }}>
            {up?'+':''}{trendVal}% vs last month
          </span>
        </div>
      )}
    </div>
  );
};

/** Section heading */
const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize:15, fontWeight:700, color:'#111827', margin:'0 0 14px', display:'flex', alignItems:'center', gap:8 }}>
    {children}
  </h2>
);

/** Chart wrapper card */
const ChartCard = ({ title, children, style }) => (
  <div style={{
    background:'#fff', borderRadius:16, padding:'20px 22px',
    boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid #f0f0f0',
    ...style,
  }}>
    {title && <SectionTitle>{title}</SectionTitle>}
    {children}
  </div>
);

/** Mini badge */
const StatusBadge = ({ status }) => {
  const map = {
    paid:    { bg:'#d1fae5', c:'#065f46' },
    partial: { bg:'#fef3c7', c:'#92400e' },
    unpaid:  { bg:'#fee2e2', c:'#991b1b' },
    partia:  { bg:'#fef3c7', c:'#92400e' },
  };
  const s = map[status] || { bg:'#f3f4f6', c:'#374151' };
  return (
    <span style={{ padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700, background:s.bg, color:s.c, textTransform:'capitalize' }}>
      {status || '—'}
    </span>
  );
};

/** Loading skeleton */
const Skeleton = ({ h = 20, w = '100%', r = 8 }) => (
  <div style={{ height:h, width:w, borderRadius:r, background:'linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}/>
);

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899'];
const TIP_STYLE = { borderRadius:10, fontSize:12, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' };

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data, setData]     = useState({ sales:[], purchases:[], products:[], expenses:[], incomes:[], customers:[] });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState('month'); // today | week | month | all

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [sales, purchases, products, expenses, incomes, customers] = await Promise.all([
        apiFetch(EP.sales), apiFetch(EP.purchases), apiFetch(EP.products),
        apiFetch(EP.expenses), apiFetch(EP.incomes), apiFetch(EP.customers),
      ]);
      setData({ sales, purchases, products, expenses, incomes, customers });
      setLoading(false);
    })();
  }, []);

  // ── Period filter ─────────────────────────────────────────────────────────
  const filterByPeriod = (arr, dateField = 'created_at') => {
    const now = new Date();
    return arr.filter(item => {
      const d = new Date(item[dateField] || '');
      if (isNaN(d)) return false;
      if (period === 'today') return toDate(item[dateField]) === todayStr;
      if (period === 'week') {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (period === 'month') return toMonth(item[dateField]) === thisMonth;
      return true; // all
    });
  };

  // ── Computed metrics ──────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const sales     = filterByPeriod(data.sales);
    const purchases = filterByPeriod(data.purchases);
    const expenses  = filterByPeriod(data.expenses);
    const incomes   = filterByPeriod(data.incomes);

    // Last month for comparison
    const lastSales = data.sales.filter(s => toMonth(s.created_at) === lastMonth);
    const lastPurch = data.purchases.filter(p => toMonth(p.created_at) === lastMonth);

    const totalSales    = sales.reduce((s,x) => s + parseFloat(x.total_amount||0), 0);
    const totalPurchase = purchases.reduce((s,x) => s + parseFloat(x.total_amount||0), 0);
    const totalExpense  = expenses.reduce((s,x) => s + parseFloat(x.amount||0), 0);
    const totalIncome   = incomes.reduce((s,x) => s + parseFloat(x.amount||0), 0);
    const totalDue      = sales.reduce((s,x) => s + parseFloat(x.due_amount||0), 0);
    const profit        = totalSales + totalIncome - totalPurchase - totalExpense;

    const lastSalesTotal = lastSales.reduce((s,x) => s + parseFloat(x.total_amount||0), 0);
    const lastPurchTotal = lastPurch.reduce((s,x) => s + parseFloat(x.total_amount||0), 0);

    const lowStock = data.products.filter(p => (p.stock||0) <= (p.alarm_when_stock_is_lessthanOrEqualto||10));

    return {
      totalSales, totalPurchase, totalExpense, totalIncome, totalDue, profit,
      salesCount: sales.length, purchaseCount: purchases.length,
      salesTrend: pct(totalSales, lastSalesTotal),
      purchTrend: pct(totalPurchase, lastPurchTotal),
      lowStockCount: lowStock.length,
      totalProducts: data.products.length,
      totalCustomers: data.customers.length,
      paidSales:    sales.filter(s => s.payment_status === 'paid').length,
      partialSales: sales.filter(s => s.payment_status === 'partial').length,
      unpaidSales:  sales.filter(s => s.payment_status === 'unpaid').length,
    };
  }, [data, period]);

  // ── Chart: daily sales trend (last 14 days) ───────────────────────────────
  const salesTrendData = useMemo(() => {
    const map = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = { date: key.slice(5), sales: 0, purchase: 0 };
    }
    data.sales.forEach(s => { const k = toDate(s.created_at); if (map[k]) map[k].sales += parseFloat(s.total_amount||0); });
    data.purchases.forEach(p => { const k = toDate(p.created_at); if (map[k]) map[k].purchase += parseFloat(p.total_amount||0); });
    return Object.values(map);
  }, [data.sales, data.purchases]);

  // ── Chart: sales by payment method ───────────────────────────────────────
  const paymentMethodData = useMemo(() => {
    const map = {};
    filterByPeriod(data.sales).forEach(s => {
      const k = s.payment_method || 'unknown';
      if (!map[k]) map[k] = { name: k, value: 0 };
      map[k].value += parseFloat(s.total_amount||0);
    });
    return Object.values(map).sort((a,b) => b.value - a.value);
  }, [data.sales, period]);

  // ── Chart: monthly revenue vs expense ────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = {};
    data.sales.forEach(s => {
      const m = toMonth(s.created_at); if (!m) return;
      if (!map[m]) map[m] = { month: m.slice(5), revenue: 0, expense: 0, profit: 0 };
      map[m].revenue += parseFloat(s.total_amount||0);
    });
    data.expenses.forEach(e => {
      const m = toMonth(e.created_at); if (!m) return;
      if (!map[m]) map[m] = { month: m.slice(5), revenue: 0, expense: 0, profit: 0 };
      map[m].expense += parseFloat(e.amount||0);
    });
    Object.values(map).forEach(m => { m.profit = m.revenue - m.expense; });
    return Object.values(map).sort((a,b) => a.month.localeCompare(b.month)).slice(-6);
  }, [data]);

  // ── Top products by sales ─────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const map = {};
    filterByPeriod(data.sales).forEach(sale => {
      (sale.items||[]).forEach(item => {
        const k = item.product_name || `P${item.product}`;
        if (!map[k]) map[k] = { name: k, qty: 0, revenue: 0 };
        map[k].qty += item.quantity || 0;
        map[k].revenue += parseFloat(item.total_price||0);
      });
    });
    return Object.values(map).sort((a,b) => b.revenue - a.revenue).slice(0, 5);
  }, [data.sales, period]);

  // ── Recent transactions ───────────────────────────────────────────────────
  const recentSales = useMemo(() =>
    [...data.sales].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6),
  [data.sales]);

  // ── Low stock items ───────────────────────────────────────────────────────
  const lowStockItems = useMemo(() =>
    data.products
      .filter(p => (p.stock||0) <= (p.alarm_when_stock_is_lessthanOrEqualto||10))
      .sort((a,b) => (a.stock||0) - (b.stock||0))
      .slice(0, 5),
  [data.products]);

  // ─────────────────────────────────────────────────────────────────────────
  const PERIODS = [
    { key:'today', label:"Today" },
    { key:'week',  label:"This Week" },
    { key:'month', label:"This Month" },
    { key:'all',   label:"All Time" },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .dash-card { animation: fadeUp .4s ease both; }
        .period-btn:hover { background: #f3f4f6 !important; }
        .period-btn.active { background: #111827 !important; color: white !important; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #f0f0f0', padding:'0 32px', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'#111827', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:16 }}>🏪</span>
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:16, fontWeight:800, color:'#111827', letterSpacing:'-0.3px' }}>MyShop POS</h1>
              <p style={{ margin:0, fontSize:11, color:'#9ca3af' }}>Dashboard Overview</p>
            </div>
          </div>

          {/* Period switcher */}
          <div style={{ display:'flex', gap:4, background:'#f9fafb', borderRadius:10, padding:4, border:'1px solid #f0f0f0' }}>
            {PERIODS.map(p => (
              <button key={p.key}
                className={`period-btn ${period===p.key?'active':''}`}
                onClick={() => setPeriod(p.key)}
                style={{ padding:'5px 14px', borderRadius:7, border:'none', fontSize:12, fontWeight:600, cursor:'pointer', color:period===p.key?'white':'#6b7280', background:period===p.key?'#111827':'transparent', transition:'all .15s' }}>
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize:12, color:'#9ca3af', fontFamily:"'DM Mono', monospace" }}>
            {todayStr}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'28px 32px', display:'flex', flexDirection:'column', gap:24 }}>

        {/* ── KPI CARDS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:14 }}>
          {[
            { label:'Total Sales',     value: loading ? '—' : currency(metrics.totalSales),    sub:`${metrics.salesCount} orders`,     icon:TrendingUp,   color:'#6366f1', trendVal:metrics.salesTrend },
            { label:'Total Purchase',  value: loading ? '—' : currency(metrics.totalPurchase), sub:`${metrics.purchaseCount} orders`,  icon:Truck,        color:'#f59e0b', trendVal:metrics.purchTrend },
            { label:'Net Profit',      value: loading ? '—' : currency(metrics.profit),        sub:'Sales – Purchase – Expense',       icon:DollarSign,   color: metrics.profit>=0?'#10b981':'#ef4444' },
            { label:'Total Due',       value: loading ? '—' : currency(metrics.totalDue),      sub:'Pending collection',               icon:AlertTriangle,color:'#ef4444' },
            { label:'Products',        value: loading ? '—' : metrics.totalProducts,           sub:`${metrics.lowStockCount} low stock`, icon:Package,    color:'#8b5cf6' },
            { label:'Customers',       value: loading ? '—' : metrics.totalCustomers,          sub:'Registered',                       icon:ShoppingCart, color:'#06b6d4' },
          ].map((c, i) => (
            <div key={i} className="dash-card" style={{ animationDelay:`${i*0.06}s` }}>
              {loading
                ? <div style={{ background:'#fff', borderRadius:16, padding:'20px 22px', border:'1px solid #f0f0f0' }}><Skeleton h={12} w="60%"/><div style={{marginTop:12}}/><Skeleton h={28} w="80%"/></div>
                : <KPICard {...c} />
              }
            </div>
          ))}
        </div>

        {/* ── CHARTS ROW 1 ── */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          {/* Sales vs Purchase trend */}
          <ChartCard title="📈 Sales vs Purchase — Last 14 Days">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesTrendData} margin={{top:5,right:5,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gPurch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="date" tick={{fontSize:11,fill:'#9ca3af'}}/>
                <YAxis tick={{fontSize:11,fill:'#9ca3af'}} width={55} tickFormatter={v=>`৳${v>=1000?Math.round(v/1000)+'k':v}`}/>
                <Tooltip contentStyle={TIP_STYLE} formatter={(v,n)=>[currency(v), n==='sales'?'Sales':'Purchase']}/>
                <Area type="monotone" dataKey="sales"    stroke="#6366f1" strokeWidth={2} fill="url(#gSales)" name="sales"/>
                <Area type="monotone" dataKey="purchase" stroke="#f59e0b" strokeWidth={2} fill="url(#gPurch)" name="purchase"/>
              </AreaChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display:'flex', gap:16, marginTop:8, justifyContent:'flex-end' }}>
              {[['#6366f1','Sales'],['#f59e0b','Purchase']].map(([c,l])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:c }}/>
                  <span style={{ fontSize:11, color:'#6b7280', fontWeight:500 }}>{l}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Payment method pie */}
          <ChartCard title="💳 By Payment Method">
            {loading
              ? <Skeleton h={200}/>
              : paymentMethodData.length === 0
                ? <div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:13}}>No data</div>
                : <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={paymentMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                          {paymentMethodData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                        </Pie>
                        <Tooltip contentStyle={TIP_STYLE} formatter={v=>[currency(v),'Amount']}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                      {paymentMethodData.map((d,i)=>(
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:8, height:8, borderRadius:2, background:COLORS[i%COLORS.length], flexShrink:0 }}/>
                            <span style={{ fontSize:12, color:'#374151', textTransform:'capitalize' }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize:12, fontWeight:600, color:'#111827', fontFamily:"'DM Mono',monospace" }}>{currency(d.value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
            }
          </ChartCard>
        </div>

        {/* ── CHARTS ROW 2 ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {/* Monthly Revenue vs Expense */}
          <ChartCard title="📊 Monthly Revenue vs Expense">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{top:5,right:5,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#9ca3af'}}/>
                <YAxis tick={{fontSize:11,fill:'#9ca3af'}} width={55} tickFormatter={v=>`৳${v>=1000?Math.round(v/1000)+'k':v}`}/>
                <Tooltip contentStyle={TIP_STYLE} formatter={(v,n)=>[currency(v),n]}/>
                <Bar dataKey="revenue" fill="#6366f1" name="Revenue" radius={[4,4,0,0]}/>
                <Bar dataKey="expense" fill="#ef4444" name="Expense"  radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Products */}
          <ChartCard title="🏆 Top Products">
            {loading
              ? <div style={{display:'flex',flexDirection:'column',gap:10}}>{[...Array(5)].map((_,i)=><Skeleton key={i} h={32}/>)}</div>
              : topProducts.length === 0
                ? <div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:13}}>No sales data</div>
                : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {topProducts.map((p, i) => {
                      const maxRev = topProducts[0].revenue;
                      const barW = maxRev > 0 ? (p.revenue / maxRev * 100) : 0;
                      return (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#9ca3af', width:16, textAlign:'center' }}>{i+1}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                              <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{p.name}</span>
                              <span style={{ fontSize:11, color:'#6b7280' }}>{p.qty} pcs</span>
                            </div>
                            <div style={{ height:6, background:'#f3f4f6', borderRadius:3, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${barW}%`, background:COLORS[i%COLORS.length], borderRadius:3, transition:'width .6s ease' }}/>
                            </div>
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:'#111827', fontFamily:"'DM Mono',monospace", width:70, textAlign:'right' }}>{currency(p.revenue)}</span>
                        </div>
                      );
                    })}
                  </div>
            }
          </ChartCard>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>

          {/* Recent Sales */}
          <ChartCard title="🧾 Recent Sales" style={{ gridColumn:'span 2' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid #f3f4f6' }}>
                    {['Invoice','Customer','Date','Method','Amount','Status'].map(h=>(
                      <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontWeight:700, color:'#9ca3af', fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? [...Array(5)].map((_,i)=>(
                        <tr key={i}><td colSpan={6} style={{padding:10}}><Skeleton h={20}/></td></tr>
                      ))
                    : recentSales.map((s,i)=>(
                        <tr key={i} style={{ borderBottom:'1px solid #f9fafb' }}
                          onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{ padding:'10px 12px', fontFamily:"'DM Mono',monospace", color:'#6366f1', fontWeight:500 }}>{s.invoice_no}</td>
                          <td style={{ padding:'10px 12px', color:'#374151', fontWeight:500 }}>{s.customer_name||'Walk-in'}</td>
                          <td style={{ padding:'10px 12px', color:'#9ca3af' }}>{toDate(s.created_at)}</td>
                          <td style={{ padding:'10px 12px', color:'#6b7280', textTransform:'capitalize' }}>{s.payment_method}</td>
                          <td style={{ padding:'10px 12px', fontWeight:700, color:'#111827', fontFamily:"'DM Mono',monospace" }}>{currency(s.total_amount)}</td>
                          <td style={{ padding:'10px 12px' }}><StatusBadge status={s.payment_status}/></td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Low Stock Alert */}
          <ChartCard title="⚠️ Low Stock Alert">
            {loading
              ? <div style={{display:'flex',flexDirection:'column',gap:10}}>{[...Array(4)].map((_,i)=><Skeleton key={i} h={44}/>)}</div>
              : lowStockItems.length === 0
                ? <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:150, gap:8 }}>
                    <CheckCircle size={28} color="#10b981"/>
                    <p style={{ margin:0, fontSize:13, color:'#6b7280', textAlign:'center' }}>All products well stocked!</p>
                  </div>
                : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {lowStockItems.map((p,i)=>(
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:10, background: p.stock<=0?'#fef2f2':'#fffbeb', border:`1px solid ${p.stock<=0?'#fecaca':'#fde68a'}` }}>
                        <div>
                          <p style={{ margin:0, fontSize:12, fontWeight:600, color:'#374151' }}>{p.name}</p>
                          <p style={{ margin:'2px 0 0', fontSize:11, color:'#9ca3af' }}>{p.category_name}</p>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <p style={{ margin:0, fontSize:16, fontWeight:800, color: p.stock<=0?'#dc2626':'#d97706' }}>{p.stock}</p>
                          <p style={{ margin:0, fontSize:10, color:'#9ca3af' }}>in stock</p>
                        </div>
                      </div>
                    ))}
                    {data.products.filter(p=>(p.stock||0)<=(p.alarm_when_stock_is_lessthanOrEqualto||10)).length > 5 && (
                      <p style={{ margin:0, fontSize:11, color:'#9ca3af', textAlign:'center' }}>
                        +{data.products.filter(p=>(p.stock||0)<=(p.alarm_when_stock_is_lessthanOrEqualto||10)).length - 5} more items
                      </p>
                    )}
                  </div>
            }
          </ChartCard>

        </div>

        {/* ── PAYMENT STATUS SUMMARY ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { label:'Paid Orders',    val:metrics.paidSales,    icon:CheckCircle, color:'#10b981', bg:'#f0fdf4' },
            { label:'Partial Orders', val:metrics.partialSales, icon:Clock,       color:'#f59e0b', bg:'#fffbeb' },
            { label:'Unpaid Orders',  val:metrics.unpaidSales,  icon:XCircle,     color:'#ef4444', bg:'#fef2f2' },
          ].map(({ label, val, icon:Icon, color, bg }, i) => (
            <div key={i} style={{ background:bg, borderRadius:14, padding:'18px 22px', border:`1px solid ${color}22`, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:color+'20', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={20} color={color}/>
              </div>
              <div>
                <p style={{ margin:0, fontSize:22, fontWeight:800, color:'#111827' }}>{loading ? '—' : val}</p>
                <p style={{ margin:0, fontSize:12, color:'#6b7280', fontWeight:500 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
// src/POS/Reports/components/SummaryCards.jsx
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Wallet, AlertTriangle } from 'lucide-react';
import { fmtCurrency, fmtInt } from '../config/sections';

/**
 * Aggregated summary cards — active section অনুযায়ী different metrics।
 */
const CARD_CONFIGS = {
    profit: [
        { key: 'total_revenue', label: 'Total Revenue', icon: DollarSign, color: '#0ea5e9', type: 'currency' },
        { key: 'total_cost', label: 'Cost of Goods', icon: Package, color: '#64748b', type: 'currency' },
        { key: 'gross_profit', label: 'Gross Profit', icon: TrendingUp, color: '#10b981', type: 'currency' },
        { key: 'total_operational_expense', label: 'Operational Expense', icon: TrendingDown, color: '#ef4444', type: 'currency' },
        { key: 'accrual_total_net_profit_with_damage_loss', label: 'Final Net Profit', icon: Wallet, color: '#059669', type: 'currency', highlight: true },
        { key: 'received_net_sale_value', label: 'Cash Received', icon: DollarSign, color: '#0ea5e9', type: 'currency' },
        { key: 'net_sale_value_dues', label: 'Outstanding Due', icon: AlertTriangle, color: '#f59e0b', type: 'currency' },
        { key: 'total_units_sold', label: 'Units Sold', icon: Package, color: '#8b5cf6', type: 'int' },
        // 🆕 Per-Invoice Averages
        { key: 'average_net_sale_value_per_invoice', label: 'Sale Value / Invoice', icon: DollarSign, color: '#0ea5e9', type: 'currency' },
        // { key: 'average_net_sale_value_per_invoice', label: 'Sale Value / Invoice (AOV)', icon: DollarSign, color: '#0ea5e9', type: 'currency' },
        { key: 'average_gross_profit_per_invoice', label: 'Gross Profit / Invoice', icon: TrendingUp, color: '#10b981', type: 'currency' },
        { key: 'average_net_profit_per_invoice', label: 'Net Profit / Invoice', icon: Wallet, color: '#059669', type: 'currency' },
        { key: 'average_units_sold_per_invoice', label: 'Units / Invoice', icon: Package, color: '#8b5cf6', type: 'number' },
    ],
    inventory: [
        { key: 'total_present_unitsOrQuantity_in_inventory', label: 'Units in Stock', icon: Package, color: '#8b5cf6', type: 'int' },
        { key: 'total_present_inventory_purchase_value', label: 'Stock Purchase Value', icon: DollarSign, color: '#0ea5e9', type: 'currency' },
        { key: 'average_profit_percentage_on_accrual_net_sale_value', label: 'Avg Margin %', icon: TrendingUp, color: '#10b981', type: 'percent' },
        { key: 'total_present_inventory_sale_value_on_margin', label: 'Est. Sale Value', icon: Wallet, color: '#059669', type: 'currency' },
    ],
    growth: [
        { key: 'total_asset', label: 'Total Asset', icon: Wallet, color: '#0ea5e9', type: 'currency', highlight: true },
        { key: 'net_profit', label: 'Net Profit', icon: TrendingUp, color: '#10b981', type: 'currency' },
        { key: 'growth_percentage', label: 'Growth %', icon: TrendingUp, color: '#8b5cf6', type: 'percent' },
        { key: 'roa', label: 'ROA %', icon: TrendingUp, color: '#f59e0b', type: 'percent' },
        { key: 'cash_flow', label: 'Cash Flow', icon: DollarSign, color: '#0ea5e9', type: 'currency' },
        { key: 'total_investment', label: 'Investment', icon: Wallet, color: '#6366f1', type: 'currency' },
        { key: 'total_withdraw', label: 'Withdraw', icon: Wallet, color: '#ef4444', type: 'currency' },
    ],
};

const fmtPercent = (v) => `${parseFloat(v || 0).toFixed(2)}%`;

const SummaryCards = ({ section, aggregated }) => {
    if (!aggregated) return null;

    const configs = CARD_CONFIGS[section] || CARD_CONFIGS.profit;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 10,
            marginBottom: 16,
        }}>
            {configs.map((cfg) => {
                const value = aggregated[cfg.key];
                const Icon = cfg.icon;
                const isNegative = typeof value === 'number' && value < 0;
                const display = cfg.type === 'currency'
                    ? fmtCurrency(value)
                    : cfg.type === 'int'
                        ? fmtInt(value)
                        : cfg.type === 'percent'
                            ? fmtPercent(value)
                            : value ?? '—';

                return (
                    <div
                        key={cfg.key}
                        style={{
                            background: cfg.highlight ? `${cfg.color}08` : 'white',
                            borderRadius: 10,
                            padding: '12px 14px',
                            border: cfg.highlight
                                ? `1.5px solid ${cfg.color}40`
                                : '1px solid #e2e8f0',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 6,
                        }}>
                            <span style={{
                                fontSize: 10,
                                color: '#64748b',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                            }}>
                                {cfg.label}
                            </span>
                            <Icon size={14} color={cfg.color} />
                        </div>
                        <div style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: isNegative ? '#dc2626' : '#0f172a',
                            wordBreak: 'break-all',
                        }}>
                            {display}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SummaryCards;
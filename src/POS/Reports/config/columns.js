// src/POS/Reports/config/columns.js
/**
 * 📋 সব column-এর metadata — single source of truth।
 *
 * প্রতিটা column entry:
 * {
 *   key: 'total_revenue',      // backend field name
 *   label: 'Revenue',           // table header-এ দেখাবে
 *   section: 'sale',            // কোন section-এ পড়ে
 *   type: 'currency',           // rendering type
 *   default: true,              // default-এ দেখাবে কি না
 *   width: 120,                 // (optional) column width in px
 * }
 *
 * Type গুলো:
 * - currency  → ৳ 1,200.50
 * - number    → 1,200
 * - int       → 120
 * - percent   → 12.5%
 * - text      → raw text
 * - date      → formatted date
 * - notes     → business notes list
 */

// ═══════════════════════════════════════════════════════════════════
// 🔹 SECTION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════
export const SECTION_META = {
    period:     { label: 'Period',           icon: '📅', color: '#0ea5e9' },
    purchase:   { label: 'Purchase',         icon: '📦', color: '#f59e0b' },
    purchase_return: { label: 'Purchase Return', icon: '↩️', color: '#f97316' },
    sale:       { label: 'Sale',             icon: '🛒', color: '#3b82f6' },
    sale_return: { label: 'Sale Return',     icon: '↪️', color: '#8b5cf6' },
    profit:     { label: 'Profit',           icon: '📊', color: '#10b981' },
    cash_due:   { label: 'Cash & Due',       icon: '💰', color: '#059669' },
    investment: { label: 'Investment',       icon: '💼', color: '#6366f1' },
    penalty:    { label: 'Penalty',          icon: '⚖️', color: '#ef4444' },
    notes:      { label: 'Business Notes',   icon: '📝', color: '#64748b' },
};

// ═══════════════════════════════════════════════════════════════════
// 🔹 COLUMN DEFINITIONS — ProfitSummary-এর সব field
// ═══════════════════════════════════════════════════════════════════
export const PROFIT_SUMMARY_COLUMNS = [
    // ─── Period ───────────────────────────────────────────────────
    { key: 'period_key', label: 'Period', section: 'period', type: 'text', default: true, width: 110 },

    // ─── Purchase ─────────────────────────────────────────────────
    { key: 'total_purchase_count', label: 'Purchase Count', section: 'purchase', type: 'int', default: false },
    { key: 'total_units_purchased', label: 'Units Purchased', section: 'purchase', type: 'int', default: true },
    { key: 'total_purchase_price', label: 'Purchase Price', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_item_discount', label: 'Item Discount', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_global_discount', label: 'Global Discount', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_discount', label: 'Total Discount', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_value', label: 'Net Purchase Value', section: 'purchase', type: 'currency', default: true },
    { key: 'total_purchase_time_paid', label: 'Paid at Purchase', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_time_due', label: 'Due at Purchase', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_due_paid', label: 'Due Paid Later', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_value_paid', label: 'Total Paid', section: 'purchase', type: 'currency', default: true },
    { key: 'total_purchase_remaining_due', label: 'Remaining Due', section: 'purchase', type: 'currency', default: true },

    // ─── Purchase Return ──────────────────────────────────────────
    { key: 'total_purchase_return_count', label: 'Return Count', section: 'purchase_return', type: 'int', default: false },
    { key: 'total_purchase_return_units', label: 'Returned Units', section: 'purchase_return', type: 'int', default: false },
    { key: 'total_purchase_return_amount', label: 'Return Amount', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_item_penalty', label: 'Item Penalty', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_global_penalty', label: 'Global Penalty', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_penalty', label: 'Total Penalty', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_net_amount', label: 'Net Return', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_time_paid', label: 'Refund at Return', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_time_due', label: 'Due at Return', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_due_paid', label: 'Refunded Later', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_value_paid', label: 'Total Refunded', section: 'purchase_return', type: 'currency', default: false },
    { key: 'total_purchase_return_remaining_due', label: 'Our Receivable', section: 'purchase_return', type: 'currency', default: false },

    // ─── Sale ─────────────────────────────────────────────────────
    { key: 'total_sales_count', label: 'Sale Count', section: 'sale', type: 'int', default: true },
    { key: 'total_units_sold', label: 'Units Sold', section: 'sale', type: 'int', default: true },
    { key: 'total_revenue', label: 'Revenue', section: 'sale', type: 'currency', default: true },
    { key: 'total_cost', label: 'Cost of Goods', section: 'sale', type: 'currency', default: true },
    { key: 'total_item_discount', label: 'Item Discount', section: 'sale', type: 'currency', default: false },
    { key: 'total_global_discount', label: 'Global Discount', section: 'sale', type: 'currency', default: false },
    { key: 'total_discount', label: 'Total Discount', section: 'sale', type: 'currency', default: true },
    { key: 'accrual_net_sale_value', label: 'Net Sale Value', section: 'sale', type: 'currency', default: true },

        // ─── Per-Invoice Averages (AOV) ───────────────────────────────
    { key: 'average_net_sale_value_per_invoice', label: 'Avg Sale / Invoice (AOV)', section: 'sale', type: 'currency', default: true },
    { key: 'average_gross_profit_per_invoice', label: 'Avg Gross Profit / Invoice', section: 'sale', type: 'currency', default: true },
    { key: 'average_net_profit_per_invoice', label: 'Avg Net Profit / Invoice', section: 'sale', type: 'currency', default: true },
    { key: 'average_units_sold_per_invoice', label: 'Avg Units / Invoice', section: 'sale', type: 'number', default: true },

    // ─── Profit ───────────────────────────────────────────────────
    { key: 'gross_profit', label: 'Gross Profit', section: 'profit', type: 'currency', default: true },
    { key: 'average_profit_percentage_on_accrual_net_sale_value', label: 'Margin %', section: 'profit', type: 'percent', default: true },
    { key: 'average_profit_percentage_on_total_cost', label: 'Markup %', section: 'profit', type: 'percent', default: false },
    { key: 'total_operational_expense', label: 'Operating Expense', section: 'profit', type: 'currency', default: true },
    { key: 'accrual_net_profit', label: 'Net Profit', section: 'profit', type: 'currency', default: true },
    { key: 'extra_income', label: 'Extra Income', section: 'profit', type: 'currency', default: false },
    { key: 'accrual_total_net_profit', label: 'Total Net Profit', section: 'profit', type: 'currency', default: false },
    { key: 'total_non_returnable_damage_loss', label: 'Damage Loss', section: 'profit', type: 'currency', default: false },
    { key: 'accrual_total_net_profit_with_damage_loss', label: 'Final Net Profit', section: 'profit', type: 'currency', default: true },

    // ─── Cash & Due ───────────────────────────────────────────────
    { key: 'total_sale_time_paid', label: 'Sale-time Cash', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_sale_time_due', label: 'Sale-time Due', section: 'cash_due', type: 'currency', default: false },
    { key: 'received_net_sale_value', label: 'Received Cash', section: 'cash_due', type: 'currency', default: true },
    { key: 'net_sale_value_dues', label: 'Outstanding Due', section: 'cash_due', type: 'currency', default: true },
    { key: 'total_due_collected', label: 'Due Collected', section: 'cash_due', type: 'currency', default: false },
    { key: 'cash_realized_gross_profit', label: 'Cash Gross Profit', section: 'cash_due', type: 'currency', default: false },
    { key: 'unrealized_gross_profit', label: 'Unrealized Profit', section: 'cash_due', type: 'currency', default: false },
    { key: 'cash_realized_net_profit', label: 'Cash Net Profit', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_cash_realized_net_profit', label: 'Total Cash Net', section: 'cash_due', type: 'currency', default: true },
    { key: 'unrealized_net_profit', label: 'Unrealized Net', section: 'cash_due', type: 'currency', default: false },

    // ─── Sale Return ──────────────────────────────────────────────
    { key: 'total_sale_return_count', label: 'Return Count', section: 'sale_return', type: 'int', default: false },
    { key: 'total_sale_return_units', label: 'Returned Units', section: 'sale_return', type: 'int', default: false },
    { key: 'total_sale_return_amount', label: 'Return Amount', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_item_penalty', label: 'Item Penalty', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_global_penalty', label: 'Global Penalty', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_penalty', label: 'Total Penalty', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_net_amount', label: 'Net Return', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_time_paid', label: 'Refunded', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_time_due', label: 'Due at Return', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_due_paid', label: 'Refunded Later', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_value_paid', label: 'Total Refunded', section: 'sale_return', type: 'currency', default: false },
    { key: 'total_sale_return_remaining_due', label: 'Our Payable', section: 'sale_return', type: 'currency', default: false },

    // ─── Due Counts ───────────────────────────────────────────────
    { key: 'total_supplier_due_payment_count', label: 'Supplier Payments', section: 'cash_due', type: 'int', default: false },
    { key: 'total_supplier_due_payment_amount', label: 'Supplier Paid', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_customer_due_payment_count', label: 'Customer Collections', section: 'cash_due', type: 'int', default: false },

    // ─── Penalty ──────────────────────────────────────────────────
    { key: 'total_return_penalty_net', label: 'Net Penalty', section: 'penalty', type: 'currency', default: false },

    // ─── Investment & Withdraw ────────────────────────────────────
    { key: 'total_investment', label: 'Investment', section: 'investment', type: 'currency', default: true },
    { key: 'total_withdraw', label: 'Withdraw', section: 'investment', type: 'currency', default: true },

    // ─── Notes (special) ──────────────────────────────────────────
    { key: 'business_notes', label: 'Business Notes', section: 'notes', type: 'notes', default: true },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 PRODUCT PROFIT COLUMNS (cumulative — period নেই)
// ═══════════════════════════════════════════════════════════════════
export const PRODUCT_PROFIT_COLUMNS = [
    { key: 'product_name', label: 'Product', section: 'period', type: 'text', default: true, width: 200 },
    { key: 'product_code', label: 'Code', section: 'period', type: 'text', default: false },

    { key: 'total_units_purchased', label: 'Units Purchased', section: 'purchase', type: 'int', default: true },
    { key: 'total_units_purchase_returned', label: 'Purchase Returned', section: 'purchase', type: 'int', default: false },
    { key: 'total_purchase_value', label: 'Purchase Value', section: 'purchase', type: 'currency', default: true },
    { key: 'total_purchase_value_paid', label: 'Paid', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_remaining_due', label: 'Purchase Due', section: 'purchase', type: 'currency', default: false },

    { key: 'total_units_sold', label: 'Units Sold', section: 'sale', type: 'int', default: true },
    { key: 'total_revenue', label: 'Revenue', section: 'sale', type: 'currency', default: true },
    { key: 'total_cost', label: 'Cost', section: 'sale', type: 'currency', default: true },
    { key: 'total_discount', label: 'Discount', section: 'sale', type: 'currency', default: false },
    { key: 'total_net_sale_value', label: 'Net Sale', section: 'sale', type: 'currency', default: false },

    { key: 'total_gross_profit', label: 'Gross Profit', section: 'profit', type: 'currency', default: true },
    { key: 'total_net_profit', label: 'Net Profit', section: 'profit', type: 'currency', default: true },
    { key: 'average_profit_percentage_on_total_net_sale_value', label: 'Margin %', section: 'profit', type: 'percent', default: true },
    { key: 'average_profit_per_unit', label: 'Profit/Unit', section: 'profit', type: 'currency', default: false },

    { key: 'total_paid', label: 'Total Paid', section: 'cash_due', type: 'currency', default: true },
    { key: 'total_after_sale_remaining_due', label: 'Remaining Due', section: 'cash_due', type: 'currency', default: true },
    { key: 'realized_gross_profit', label: 'Realized Profit', section: 'cash_due', type: 'currency', default: false },
    { key: 'unrealized_gross_profit', label: 'Unrealized Profit', section: 'cash_due', type: 'currency', default: false },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 INVENTORY VALUATION COLUMNS
// ═══════════════════════════════════════════════════════════════════
export const INVENTORY_COLUMNS = [
    { key: 'period_key', label: 'Period', section: 'period', type: 'text', default: true },
    { key: 'total_present_unitsOrQuantity_in_inventory', label: 'Units in Stock', section: 'sale', type: 'int', default: true },
    { key: 'total_present_inventory_purchase_value', label: 'Stock Purchase Value', section: 'purchase', type: 'currency', default: true },
    { key: 'average_profit_percentage_on_accrual_net_sale_value', label: 'Avg Margin %', section: 'profit', type: 'percent', default: true },
    { key: 'average_profit_percentage_on_total_cost', label: 'Avg Markup %', section: 'profit', type: 'percent', default: false },
    { key: 'total_present_inventory_sale_value_on_margin', label: 'Sale Value (Margin)', section: 'sale', type: 'currency', default: true },
    { key: 'total_present_inventory_sale_value_on_markup', label: 'Sale Value (Markup)', section: 'sale', type: 'currency', default: false },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 BUSINESS GROWTH COLUMNS
// ═══════════════════════════════════════════════════════════════════
export const GROWTH_COLUMNS = [
    { key: 'period_key', label: 'Period', section: 'period', type: 'text', default: true },
    { key: 'grand_total_balance', label: 'Cash Balance', section: 'cash_due', type: 'currency', default: true },
    { key: 'inventory_purchase_value', label: 'Inventory Value', section: 'purchase', type: 'currency', default: true },
    { key: 'total_asset', label: 'Total Asset', section: 'profit', type: 'currency', default: true },
    { key: 'growth_percentage', label: 'Growth %', section: 'profit', type: 'percent', default: true },
    { key: 'net_profit', label: 'Net Profit', section: 'profit', type: 'currency', default: true },
    { key: 'net_profit_growth', label: 'Profit Growth %', section: 'profit', type: 'percent', default: false },
    { key: 'cash_flow', label: 'Cash Flow', section: 'cash_due', type: 'currency', default: true },
    { key: 'average_inventory', label: 'Avg Inventory', section: 'purchase', type: 'currency', default: false },
    { key: 'inventory_turnover', label: 'Turnover', section: 'profit', type: 'number', default: false },
    { key: 'roa', label: 'ROA %', section: 'profit', type: 'percent', default: true },
    { key: 'total_investment', label: 'Investment', section: 'investment', type: 'currency', default: true },
    { key: 'total_withdraw', label: 'Withdraw', section: 'investment', type: 'currency', default: true },
    { key: 'net_cash_flow_from_investment', label: 'Net Cash Flow (Inv)', section: 'investment', type: 'currency', default: false },
    { key: 'total_supplier_due', label: 'Supplier Due', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_customer_due', label: 'Customer Due', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_supplier_payable', label: 'Supplier Payable', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_supplier_advance', label: 'Supplier Advance', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_customer_receivable', label: 'Customer Receivable', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_customer_advance', label: 'Customer Advance', section: 'cash_due', type: 'currency', default: false },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 SUPPLIER PROFIT COLUMNS
// ═══════════════════════════════════════════════════════════════════
export const SUPPLIER_PROFIT_COLUMNS = [
    { key: 'supplier_name', label: 'Supplier Name', section: 'purchase', type: 'text', default: true },
    { key: 'supplier_phone', label: 'Phone', section: 'purchase', type: 'text', default: true },
    { key: 'total_purchase_count', label: 'Invoices', section: 'purchase', type: 'int', default: true },
    { key: 'total_units_purchased', label: 'Units Purchased', section: 'purchase', type: 'int', default: true },
    { key: 'total_units_purchase_returned', label: 'Units Returned', section: 'purchase', type: 'int', default: false },
    { key: 'total_purchase_price', label: 'Gross Purchase', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_value', label: 'Net Purchase', section: 'purchase', type: 'currency', default: true },
    { key: 'total_purchase_time_paid', label: 'Paid at Purchase', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_due_paid', label: 'Due Paid', section: 'purchase', type: 'currency', default: false },
    { key: 'total_purchase_remaining_due', label: 'Remaining Due', section: 'purchase', type: 'currency', default: true },
    { key: 'total_return_count', label: 'Return Count', section: 'purchase', type: 'int', default: false },
    { key: 'total_return_net_amount', label: 'Net Returns', section: 'purchase', type: 'currency', default: false },
    { key: 'total_due_payment_count', label: 'Due Vouchers', section: 'purchase', type: 'int', default: false },
    { key: 'total_due_payment_amount', label: 'Total Due Paid', section: 'purchase', type: 'currency', default: false },
    { key: 'average_purchase_per_invoice', label: 'Avg / Invoice', section: 'purchase', type: 'currency', default: true },
    { key: 'average_unit_cost', label: 'Avg Unit Cost', section: 'purchase', type: 'currency', default: true },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 BRAND PROFIT COLUMNS
// ═══════════════════════════════════════════════════════════════════
export const BRAND_PROFIT_COLUMNS = [
    { key: 'brand_title', label: 'Brand Title', section: 'sale', type: 'text', default: true },
    { key: 'total_sales_count', label: 'Sale Invoices', section: 'sale', type: 'int', default: true },
    { key: 'total_units_sold', label: 'Units Sold', section: 'sale', type: 'int', default: true },
    { key: 'total_revenue', label: 'Revenue', section: 'sale', type: 'currency', default: true },
    { key: 'total_cost', label: 'Cost of Goods', section: 'sale', type: 'currency', default: true },
    { key: 'total_gross_profit', label: 'Gross Profit', section: 'profit', type: 'currency', default: false },
    { key: 'total_net_profit', label: 'Net Profit', section: 'profit', type: 'currency', default: true },
    { key: 'profit_percentage_on_sales', label: 'Margin %', section: 'profit', type: 'percent', default: true },
    { key: 'profit_percentage_on_cost', label: 'Markup %', section: 'profit', type: 'percent', default: false },
    { key: 'average_profit_per_unit', label: 'Avg Profit / Unit', section: 'profit', type: 'currency', default: true },
    { key: 'in_stock_units', label: 'In-Stock Units', section: 'purchase', type: 'int', default: true },
    { key: 'in_stock_total_purchase_value', label: 'Stock Cost', section: 'purchase', type: 'currency', default: true },
    { key: 'in_stock_total_selling_value', label: 'Stock Selling Value', section: 'sale', type: 'currency', default: true },
    { key: 'potential_profit', label: 'Potential Profit', section: 'profit', type: 'currency', default: true },
    { key: 'potential_profit_margin_pct', label: 'Potential Margin %', section: 'profit', type: 'percent', default: true },
    { key: 'total_purchase_count', label: 'Purchase Invoices', section: 'purchase', type: 'int', default: false },
    { key: 'total_units_purchased', label: 'Purchased Units', section: 'purchase', type: 'int', default: false },
    { key: 'total_purchase_value', label: 'Total Purchase', section: 'purchase', type: 'currency', default: false },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 CUSTOMER PROFIT COLUMNS
// ═══════════════════════════════════════════════════════════════════
export const CUSTOMER_PROFIT_COLUMNS = [
    { key: 'customer_name', label: 'Customer Name', section: 'sale', type: 'text', default: true },
    { key: 'customer_phone', label: 'Phone', section: 'sale', type: 'text', default: true },
    { key: 'is_walk_in', label: 'Type', section: 'sale', type: 'text', default: true },
    { key: 'total_sales_count', label: 'Invoices', section: 'sale', type: 'int', default: true },
    { key: 'total_units_bought', label: 'Units Bought', section: 'sale', type: 'int', default: true },
    { key: 'total_units_sale_returned', label: 'Units Returned', section: 'sale', type: 'int', default: false },
    { key: 'total_sale_price', label: 'Gross Sale', section: 'sale', type: 'currency', default: false },
    { key: 'total_net_sale_value', label: 'Net Sale Value', section: 'sale', type: 'currency', default: true },
    { key: 'total_cost', label: 'COGS', section: 'sale', type: 'currency', default: true },
    { key: 'total_gross_profit', label: 'Gross Profit', section: 'profit', type: 'currency', default: false },
    { key: 'total_net_profit', label: 'Net Profit', section: 'profit', type: 'currency', default: true },
    { key: 'average_profit_percentage_on_net_sale_value', label: 'Margin %', section: 'profit', type: 'percent', default: true },
    { key: 'average_profit_percentage_on_cost', label: 'Markup %', section: 'profit', type: 'percent', default: false },
    { key: 'total_sale_time_paid', label: 'Paid at Sale', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_due_collection_amount', label: 'Due Collected', section: 'cash_due', type: 'currency', default: false },
    { key: 'total_after_sale_remaining_due', label: 'Remaining Due', section: 'cash_due', type: 'currency', default: true },
    { key: 'total_return_net_amount', label: 'Net Returns', section: 'sale', type: 'currency', default: false },
    { key: 'average_sale_per_invoice', label: 'Avg / Invoice', section: 'sale', type: 'currency', default: true },
    { key: 'average_profit_per_unit', label: 'Avg Profit / Unit', section: 'profit', type: 'currency', default: true },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/** কোন section-এর সব column */
export const getColumnsBySection = (allCols, sectionKey) =>
    allCols.filter((c) => c.section === sectionKey);

/** Default selected columns (default: true) */
export const getDefaultColumns = (allCols) =>
    allCols.filter((c) => c.default).map((c) => c.key);

/** Key → column map (lookup সহজ) */
export const buildColumnMap = (allCols) =>
    allCols.reduce((acc, c) => { acc[c.key] = c; return acc; }, {});

/** কোন report type-এর columns */
export const getColumnsForReportType = (reportType) => {
    switch (reportType) {
        case 'profit-summary':   return PROFIT_SUMMARY_COLUMNS;
        case 'product-profit':   return PRODUCT_PROFIT_COLUMNS;
        case 'inventory':        return INVENTORY_COLUMNS;
        case 'growth':           return GROWTH_COLUMNS;
        case 'supplier-profit':  return SUPPLIER_PROFIT_COLUMNS;
        case 'brand-profit':     return BRAND_PROFIT_COLUMNS;
        case 'customer-profit':  return CUSTOMER_PROFIT_COLUMNS;
        default:                 return PROFIT_SUMMARY_COLUMNS;
    }
};
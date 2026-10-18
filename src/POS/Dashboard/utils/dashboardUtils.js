// src/POS/Dashboard/utils/dashboardUtils.js

// ═══════════════════════════════════════════════════════════════════
// FORMATTERS
// ═══════════════════════════════════════════════════════════════════
export const fmtCurrency = (n) => {
    if (n === null || n === undefined || n === '') return '৳0';
    return `৳${parseFloat(n).toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
};

export const fmtNumber = (n) =>
    parseFloat(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 0 });

export const fmtPct = (n) => {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    const v = parseFloat(n);
    return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
};

export const fmtCompact = (n) => {
    const num = parseFloat(n || 0);
    if (Math.abs(num) >= 10000000) return `৳${(num / 10000000).toFixed(2)}Cr`;
    if (Math.abs(num) >= 100000) return `৳${(num / 100000).toFixed(2)}L`;
    if (Math.abs(num) >= 1000) return `৳${(num / 1000).toFixed(1)}k`;
    return fmtCurrency(num);
};

export const toDate = (s) => (s ? String(s).split('T')[0] : '');
export const toMonth = (s) => (s ? String(s).slice(0, 7) : '');

export const fmtRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short',
    });
};

// ═══════════════════════════════════════════════════════════════════
// HEALTH SCORE — 0-100 (weighted average of 6 factors)
// ═══════════════════════════════════════════════════════════════════
export const HEALTH_WEIGHTS = {
    margin:     0.25,   // Profit margin
    cashFlow:   0.20,   // Cash flow
    turnover:   0.15,   // Inventory turnover
    collection: 0.15,   // Due collection ratio
    stock:      0.15,   // Stock health
    growth:     0.10,   // Growth percentage
};

export const HEALTH_LABELS = {
    margin:     'Profit Margin',
    cashFlow:   'Cash Flow',
    turnover:   'Inventory Turnover',
    collection: 'Due Collection',
    stock:      'Stock Health',
    growth:     'Business Growth',
};

// export function calculateHealthScore(data) {
//     const agg = data.profit?.aggregated || {};
//     const scores = {};
//
//     // 1. Profit Margin (target: 20%+)
//     const revenue = parseFloat(agg.total_revenue || 0);
//     const netProfit = parseFloat(
//         agg.accrual_total_net_profit_with_damage_loss
//         || agg.accrual_total_net_profit
//         || 0
//     );
//     const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
//     scores.margin = Math.max(0, Math.min(100, (margin / 20) * 100));
//
//     // 2. Cash Flow (positive grows to 100)
//     const cashFlow = parseFloat(data.growth?.cash_flow || 0);
//     scores.cashFlow = Math.max(0, Math.min(100, 50 + (cashFlow / 50000) * 50));
//
//     // 3. Inventory Turnover (2+ = 100)
//     const turnover = parseFloat(data.growth?.inventory_turnover || 0);
//     scores.turnover = Math.max(0, Math.min(100, (turnover / 2) * 100));
//
//     // 4. Due Collection Ratio (higher collected = good)
//     const received = parseFloat(agg.received_net_sale_value || 0);
//     const netSale = parseFloat(agg.accrual_net_sale_value || 0);
//     const collectionRatio = netSale > 0 ? received / netSale : 1;
//     scores.collection = Math.max(0, Math.min(100, collectionRatio * 100));
//
//     // 5. Stock Health
//     const totalProducts = data.supportData?.products?.length || 0;
//     if (totalProducts > 0) {
//         const lowStock = data.alerts?.lowStock?.length || 0;
//         const outOfStock = data.alerts?.outOfStock?.length || 0;
//         const healthy = totalProducts - lowStock - outOfStock;
//         scores.stock = Math.max(0, (healthy / totalProducts) * 100);
//     } else {
//         scores.stock = 50;
//     }
//
//     // 6. Growth (-20% → 0, +20% → 100)
//     const growth = parseFloat(data.growth?.growth_percentage || 0);
//     scores.growth = Math.max(0, Math.min(100, ((growth + 20) / 40) * 100));
//
//     // Weighted total
//     let total = 0;
//     Object.keys(HEALTH_WEIGHTS).forEach((k) => {
//         total += (scores[k] || 0) * HEALTH_WEIGHTS[k];
//     });
//
//     return {
//         score: Math.round(total),
//         breakdown: scores,
//         grade: total >= 80 ? 'Excellent'
//              : total >= 65 ? 'Good'
//              : total >= 50 ? 'Fair'
//              : total >= 35 ? 'Needs Attention'
//              : 'Critical',
//         color: total >= 80 ? '#10b981'
//              : total >= 65 ? '#0ea5e9'
//              : total >= 50 ? '#f59e0b'
//              : total >= 35 ? '#f97316'
//              : '#ef4444',
//     };
// }




export function calculateHealthScore(data) {
    const agg = data.profit?.aggregated || {};
    const scores = {};
    const isNew = {};   // ✅ কোন factor-এর data নেই তা track করবে

    // ── 1. Profit Margin ───────────────────────────────
    const revenue = parseFloat(agg.total_revenue || 0);
    const netProfit = parseFloat(
        agg.accrual_total_net_profit_with_damage_loss
        || agg.accrual_total_net_profit
        || 0
    );
    if (revenue > 0) {
        const margin = (netProfit / revenue) * 100;
        scores.margin = Math.max(0, Math.min(100, (margin / 20) * 100));
    } else {
        scores.margin = 0;
        isNew.margin = true;   // ✅
    }

    // ── 2. Cash Flow ───────────────────────────────────
    const cashFlow = parseFloat(data.growth?.cash_flow || 0);
    const hasCashFlowData = data.growth?.cash_flow !== undefined
                         && data.growth?.cash_flow !== null;
    if (hasCashFlowData) {
        // positive = good, negative = bad
        scores.cashFlow = Math.max(0, Math.min(100, 50 + (cashFlow / 50000) * 50));
    } else {
        scores.cashFlow = 0;
        isNew.cashFlow = true;   // ✅
    }

    // ── 3. Inventory Turnover ──────────────────────────
    const turnover = parseFloat(data.growth?.inventory_turnover || 0);
    const hasTurnoverData = data.growth?.inventory_turnover !== undefined
                         && data.growth?.inventory_turnover !== null;
    if (hasTurnoverData && turnover > 0) {
        scores.turnover = Math.max(0, Math.min(100, (turnover / 2) * 100));
    } else {
        scores.turnover = 0;
        isNew.turnover = true;   // ✅
    }

    // ── 4. Due Collection ──────────────────────────────
    const received = parseFloat(agg.received_net_sale_value || 0);
    const netSale = parseFloat(agg.accrual_net_sale_value || 0);
    if (netSale > 0) {
        const collectionRatio = received / netSale;
        scores.collection = Math.max(0, Math.min(100, collectionRatio * 100));
    } else {
        scores.collection = 0;
        isNew.collection = true;   // ✅ ratio = 1 বাদ
    }

    // ── 5. Stock Health ────────────────────────────────
    const totalProducts = data.supportData?.products?.length || 0;
    if (totalProducts > 0) {
        const lowStock = data.alerts?.lowStock?.length || 0;
        const outOfStock = data.alerts?.outOfStock?.length || 0;
        const healthy = totalProducts - lowStock - outOfStock;
        scores.stock = Math.max(0, (healthy / totalProducts) * 100);
    } else {
        scores.stock = 0;
        isNew.stock = true;   // ✅ 50 বাদ
    }

    // ── 6. Business Growth ─────────────────────────────
    const growth = parseFloat(data.growth?.growth_percentage || 0);
    const hasGrowthData = data.growth?.growth_percentage !== undefined
                       && data.growth?.growth_percentage !== null;
    if (hasGrowthData && revenue > 0) {
        scores.growth = Math.max(0, Math.min(100, ((growth + 20) / 40) * 100));
    } else {
        scores.growth = 0;
        isNew.growth = true;   // ✅ 50 বাদ
    }

    // ── Weighted total ─────────────────────────────────
    // ✅ যেসব factor-এ data নেই, সেগুলোকে weight calculation থেকে বাদ দাও
    let total = 0;
    let totalWeight = 0;
    Object.keys(HEALTH_WEIGHTS).forEach((k) => {
        if (!isNew[k]) {
            total += (scores[k] || 0) * HEALTH_WEIGHTS[k];
            totalWeight += HEALTH_WEIGHTS[k];
        }
    });

    // ✅ যদি সব factor empty হয় → score = 0, grade = 'New'
    const finalScore = totalWeight > 0 ? Math.round(total / totalWeight) : 0;
    const isBrandNew = Object.keys(isNew).length === Object.keys(HEALTH_WEIGHTS).length;

    let grade, color;
    if (isBrandNew) {
        grade = 'New';
        color = '#94a3b8';   // slate gray
    } else if (finalScore >= 80) {
        grade = 'Excellent'; color = '#10b981';
    } else if (finalScore >= 65) {
        grade = 'Good'; color = '#0ea5e9';
    } else if (finalScore >= 50) {
        grade = 'Fair'; color = '#f59e0b';
    } else if (finalScore >= 35) {
        grade = 'Needs Attention'; color = '#f97316';
    } else {
        grade = 'Critical'; color = '#ef4444';
    }

    return {
        score: finalScore,
        breakdown: scores,
        isNew,                     // ✅ কোন factor missing তা UI-তে দেখানোর জন্য
        isBrandNew,                // ✅ পুরো database empty কিনা
        grade,
        color,
    };
}



// ═══════════════════════════════════════════════════════════════════
// INSIGHTS — Rule-based smart suggestions
// ═══════════════════════════════════════════════════════════════════
export function generateInsights(data) {
    const insights = [];
    const agg = data.profit?.aggregated || {};
    const cmp = data.profit?.comparison?.changes_pct || {};

    // 1. Profit trend
    const profitChange = cmp.accrual_total_net_profit_with_damage_loss
        ?? cmp.accrual_total_net_profit;
    if (profitChange !== null && profitChange !== undefined && isFinite(profitChange)) {
        if (profitChange > 15) {
            insights.push({
                type: 'success',
                icon: '🚀',
                text: `প্রফিট ${profitChange.toFixed(0)}% বেড়েছে — ব্যবসা বিনিয়োগের উপযুক্ত`,
                action: '/reports',
            });
        } else if (profitChange < -15) {
            insights.push({
                type: 'danger',
                icon: '📉',
                text: `প্রফিট ${Math.abs(profitChange).toFixed(0)}% কমেছে — খরচ যাচাই করুন`,
                action: '/expense',
            });
        }
    }

    // 2. Customer due
    const due = parseFloat(agg.net_sale_value_dues || 0);
    if (due > 5000) {
        insights.push({
            type: 'warning',
            icon: '💰',
            text: `${fmtCompact(due)} কাস্টমারের কাছে বাকি — আদায়ের জন্য তাগাদা দিন`,
            action: '/sales',
        });
    }

    // 3. Out of stock
    const outCount = data.alerts?.outOfStock?.length || 0;
    if (outCount > 0) {
        insights.push({
            type: 'danger',
            icon: '🚨',
            text: `${outCount}টি পণ্য স্টক শেষ — এখনই কিনুন, না হলে বিক্রি হারাবেন`,
            action: '/inventory',
        });
    }

    // 4. Low stock
    const lowCount = data.alerts?.lowStock?.length || 0;
    if (lowCount > 0 && outCount === 0) {
        insights.push({
            type: 'warning',
            icon: '⚠️',
            text: `${lowCount}টি পণ্য কম স্টকে — রিস্টক করুন`,
            action: '/inventory',
        });
    }

    // 5. Collection performance
    const received = parseFloat(agg.received_net_sale_value || 0);
    const netSale = parseFloat(agg.accrual_net_sale_value || 0);
    if (netSale > 0) {
        const ratio = (received / netSale) * 100;
        if (ratio < 60) {
            insights.push({
                type: 'warning',
                icon: '📊',
                text: `শুধু ${ratio.toFixed(0)}% বিক্রয় নগদে — বাকি বেশি`,
                action: '/sales',
            });
        } else if (ratio > 90) {
            insights.push({
                type: 'success',
                icon: '✅',
                text: `${ratio.toFixed(0)}% বিক্রয় নগদে — চমৎকার cash collection`,
                action: null,
            });
        }
    }

    // 6. High profit margin
    const revenue = parseFloat(agg.total_revenue || 0);
    const profit = parseFloat(agg.accrual_total_net_profit || 0);
    if (revenue > 0 && profit > 0) {
        const margin = (profit / revenue) * 100;
        if (margin > 25) {
            insights.push({
                type: 'success',
                icon: '💎',
                text: `প্রফিট মার্জিন ${margin.toFixed(0)}% — অসাধারণ!`,
                action: null,
            });
        }
    }

    // 7. Loss warning
    if (profit < 0) {
        insights.push({
            type: 'danger',
            icon: '🔥',
            text: `এই period-এ লোকসান হচ্ছে — খরচ কমানোর কথা ভাবুন`,
            action: '/reports',
        });
    }

    return insights.slice(0, 4);
}

// ═══════════════════════════════════════════════════════════════════
// GOAL TRACKING
// ═══════════════════════════════════════════════════════════════════
export function getMonthlyGoal() {
    try {
        const stored = localStorage.getItem('dashboard_monthly_goal');
        return stored ? parseFloat(stored) : 500000; // default 5L
    } catch {
        return 500000;
    }
}

export function setMonthlyGoal(value) {
    try {
        localStorage.setItem('dashboard_monthly_goal', String(value));
        return true;
    } catch {
        return false;
    }
}

export function calculateGoalProgress(monthlyRevenue, goal) {
    const achieved = parseFloat(monthlyRevenue || 0);
    const target = parseFloat(goal || 1);
    const pct = Math.min(100, (achieved / target) * 100);
    const remaining = Math.max(0, target - achieved);

    // Current day progression
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const expectedPct = (currentDay / daysInMonth) * 100;

    const onTrack = pct >= expectedPct;
    const pace = pct - expectedPct;

    return {
        achieved,
        target,
        pct: Math.round(pct),
        remaining,
        onTrack,
        pace: Math.round(pace),
        expectedPct: Math.round(expectedPct),
    };
}
import React from 'react';

/**
 * StatusBadge - A standardized badge component for the POS backbone.
 * Automatically handles colors based on status types.
 * 
 * @param {string} type - The machine-readable status (e.g., 'approved', 'pending', 'active')
 * @param {string} label - The human-readable text to display
 * @param {string} className - Optional extra classes
 */
const StatusBadge = ({ type = "", label = "", className = "" }) => {
    const status = (type || label || "").toLowerCase();

    // Map status types to brand-approved styles
    const styles = {
        // Success / Positive
        success: "bg-emerald-50 text-emerald-700 border-emerald-100",
        approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
        active: "bg-emerald-50 text-emerald-700 border-emerald-100",
        present: "bg-emerald-50 text-emerald-700 border-emerald-100",
        paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
        
        // Warning / Pending
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        pending: "bg-amber-50 text-amber-700 border-amber-100",
        partial: "bg-amber-50 text-amber-700 border-amber-100",
        
        // Danger / Negative
        danger: "bg-rose-50 text-rose-700 border-rose-100",
        rejected: "bg-rose-50 text-rose-700 border-rose-100",
        inactive: "bg-rose-50 text-rose-700 border-rose-100",
        absent: "bg-rose-50 text-rose-700 border-rose-100",
        unpaid: "bg-rose-50 text-rose-700 border-rose-100",
        overdue: "bg-rose-50 text-rose-700 border-rose-100",
        
        // Info / Neutral
        info: "bg-blue-50 text-blue-700 border-blue-100",
        default: "bg-gray-50 text-gray-600 border-gray-100"
    };

    // Find the matching style or fallback to default
    const styleClass = styles[status] || 
                      (status.includes('approve') ? styles.approved : null) ||
                      (status.includes('pay') ? styles.paid : null) ||
                      (status.includes('fail') ? styles.danger : null) ||
                      styles.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${styleClass} ${className}`}>
            {label || type}
        </span>
    );
};

export default StatusBadge;

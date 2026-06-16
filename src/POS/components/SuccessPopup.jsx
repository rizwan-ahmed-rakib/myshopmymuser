import React, { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * SuccessPopup - Centralised toast popup for success, error, warning and info alerts.
 * Automatically slides in from the top-right and self-dismisses.
 */
const SuccessPopup = ({ 
    message, 
    subtitle = "Changes have been saved", 
    onClose, 
    duration = 3000, 
    type = "success" 
}) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: "from-green-500 to-emerald-600 shadow-green-100",
        error: "from-rose-500 to-red-600 shadow-red-100",
        warning: "from-amber-500 to-yellow-600 shadow-yellow-100",
        info: "from-blue-500 to-indigo-600 shadow-blue-100",
    };

    const icons = {
        success: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        error: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div className="fixed top-5 right-5 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`bg-gradient-to-r ${typeStyles[type]} text-white p-4 rounded-2xl shadow-xl min-w-[300px] border border-white/10`}>
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 bg-white/20 p-1.5 rounded-lg">
                        {icons[type] || icons.success}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className="text-sm font-bold tracking-wide">
                            {message}
                        </p>
                        {subtitle && (
                            <p className="text-xs opacity-90 mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

SuccessPopup.propTypes = {
    message: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    duration: PropTypes.number,
    type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

export default SuccessPopup;

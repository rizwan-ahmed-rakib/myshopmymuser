
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const SuccessPopup = ({ message, subtitle, onClose, duration = 3000, type = "success" }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case "success":
                return "from-green-500 to-emerald-600";
            case "error":
                return "from-red-500 to-red-600";
            case "warning":
                return "from-yellow-500 to-amber-600";
            case "info":
                return "from-blue-500 to-indigo-600";
            default:
                return "from-green-500 to-emerald-600";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case "error":
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className={`bg-gradient-to-r ${getTypeStyles()} text-white p-4 rounded-lg shadow-xl max-w-sm`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{message}</p>
                        {subtitle && <p className="text-xs opacity-90 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 -mx-1.5 -my-1.5 text-white hover:text-gray-100 rounded-lg p-1.5 inline-flex h-8 w-8"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
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
    type: PropTypes.oneOf(["success", "error", "warning", "info"])
};

export default SuccessPopup;
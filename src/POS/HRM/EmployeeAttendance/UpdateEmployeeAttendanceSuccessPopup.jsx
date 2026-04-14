// UpdateUserSalarySuccessPopup.jsx

import React, { useEffect } from "react";
import PropTypes from "prop-types";

const UpdateEmployeeAttendanceSuccessPopup = ({
    message = "Salary advance updated successfully",
    subtitle = "Changes have been saved",
    onClose,
    duration = 3000,
    type = "success",
}) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: "from-green-500 to-emerald-600",
        error: "from-red-500 to-red-600",
        warning: "from-yellow-500 to-amber-600",
        info: "from-blue-500 to-indigo-600",
    };

    const icons = {
        success: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ),
        error: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ),
        info: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01"/>
            </svg>
        ),
    };

    return (
        <div className="fixed top-5 right-5 z-50 animate-slideIn">
            <div
                className={`bg-gradient-to-r ${typeStyles[type]} text-white p-4 rounded-xl shadow-2xl min-w-[280px]`}
            >
                <div className="flex items-start gap-3">

                    {/* Icon */}
                    <div className="flex-shrink-0">
                        {icons[type] || icons.success}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold">
                            {message}
                        </p>
                        <p className="text-xs opacity-90 mt-1">
                            {subtitle}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 p-1"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

UpdateEmployeeAttendanceSuccessPopup.propTypes = {
    message: PropTypes.string,
    subtitle: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    duration: PropTypes.number,
    type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

export default UpdateEmployeeAttendanceSuccessPopup;
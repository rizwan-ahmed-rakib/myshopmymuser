import React from 'react';
import PropTypes from 'prop-types';
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

/**
 * EmployeeSelect - Reusable select dropdown for choosing employees in HRM modules.
 * Automatically wires up with useUserWithProfile context.
 */
const EmployeeSelect = ({ 
    value, 
    onChange, 
    error, 
    name = "employee", 
    label = "Select Employee *", 
    placeholder = "-- Select Employee --",
    disabled = false
}) => {
    const { allProfile } = useUserWithProfile();

    return (
        <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full p-3 bg-gray-50 border-2 rounded-2xl text-sm font-semibold focus:bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${error 
                        ? 'border-rose-500 focus:border-rose-500' 
                        : 'border-gray-100 focus:border-gray-900'
                    }
                `}
            >
                <option value="">{placeholder}</option>
                {allProfile?.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role || "Staff"})
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-rose-500 text-xs font-bold mt-1 pl-1">
                    {error}
                </p>
            )}
        </div>
    );
};

EmployeeSelect.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool
};

export default EmployeeSelect;

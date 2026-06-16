import React from 'react';
import PropTypes from 'prop-types';

/**
 * EmptyState - A standardised empty state dashboard message.
 * Encourages the user to create a record if none exist.
 */
const EmptyState = ({ 
    icon, 
    title = "No records found", 
    description = "Get started by adding your first record.", 
    actionText, 
    onAction 
}) => {
    return (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/30 mt-4 select-none">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 text-gray-400">
                {icon}
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">{title}</h3>
            {description && <p className="text-xs text-gray-400 font-semibold mb-5">{description}</p>}
            {actionText && onAction && (
                <button 
                    onClick={onAction} 
                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100 active:scale-95 transition-all"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    actionText: PropTypes.string,
    onAction: PropTypes.func
};

export default EmptyState;

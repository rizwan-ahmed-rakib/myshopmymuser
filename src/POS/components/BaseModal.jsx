import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * BaseModal - A generic modal wrapper for consistency across the POS system.
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Callback when close button or overlay is clicked
 * @param {string} title - Modal heading
 * @param {React.ReactNode} children - Modal content
 * @param {string} maxWidth - Tailwind max-width class (default: max-w-2xl)
 * @param {string} headerColor - Background color for header (default: bg-blue-600)
 * @param {React.ReactNode} icon - Optional icon next to the title
 */
const BaseModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = "max-w-2xl", 
    headerColor = "bg-blue-600",
    icon = null
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200`}>
                {/* Header */}
                <div className={`${headerColor} px-6 py-4 text-white flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                        {icon && <div className="bg-white bg-opacity-20 p-2 rounded-lg">{icon}</div>}
                        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-70px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BaseModal;

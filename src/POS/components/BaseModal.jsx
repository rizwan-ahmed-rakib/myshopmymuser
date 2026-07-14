import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

/**
 * BaseModal - A highly customizable, branded, and accessible modal wrapper.
 * Centralizes backdrop, animations, escape listeners, custom borders, and footer buttons.
 */
const BaseModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = "md", // sm (max-w-md), md (max-w-lg), lg (max-w-2xl), xl (max-w-4xl)
    variant = "primary", // primary (gradient header), clean (white header), danger (red header)
    icon = null,
    
    // Border customisation
    hasBorder = false,
    borderColor = "border-brand-primary",
    
    // Actions Footer
    showFooter = false,
    onSubmit = null,
    submitText = "Save Changes",
    cancelText = "Cancel",
    submitColor = "bg-brand-primary hover:bg-brand-primaryHover text-white",
    isLoading = false,
    isSubmitDisabled = false,
}) => {
    
    // Listen for Escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !isLoading) onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    // Size preset widths
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
        "3xl": "max-w-7xl",
        "4xl": "max-w-[90vw]",
        "5xl": "max-w-[95vw]",
    };

    // Header theme styling
    const headerClasses = {
        primary: "bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white",
        clean: "bg-white border-b border-gray-100 text-gray-800",
        danger: "bg-rose-600 text-white"
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Click outside to close (disabled when loading) */}
            <div className="absolute inset-0" onClick={() => { if (!isLoading) onClose(); }}></div>
            
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col
                ${hasBorder ? `border-2 ${borderColor}` : ''}
            `}>
                
                {/* Header */}
                <div className={`${headerClasses[variant]} px-6 py-4 flex justify-between items-center flex-shrink-0`}>
                    <div className="flex items-center gap-3">
                        {icon && <div className="p-2 bg-white/10 rounded-lg">{icon}</div>}
                        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isLoading}
                        className={`rounded-full p-2 transition-colors disabled:opacity-50
                            ${variant === 'clean' 
                                ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600' 
                                : 'hover:bg-white/20 text-white'
                            }
                        `}
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="overflow-y-auto p-6 flex-1">
                    {children}
                </div>

                {/* Optional Actions Footer */}
                {showFooter && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-semibold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            type={onSubmit ? "button" : "submit"}
                            onClick={onSubmit}
                            disabled={isLoading || isSubmitDisabled}
                            className={`px-5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${submitColor}`}
                        >
                            {isLoading && <LoadingSpinner size="xs" />}
                            {isLoading ? "Saving..." : submitText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BaseModal;

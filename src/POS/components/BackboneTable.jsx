import React from 'react';
import { ChevronRight, Inbox } from 'lucide-react';

/**
 * BackboneTable - A universal, high-fidelity table component.
 * 
 * @param {Array} columns - Array of { header: string, accessor: string, render: func, className: string, hiddenMobile: boolean }
 * @param {Array} data - The data array to display
 * @param {boolean} loading - Loading state
 * @param {Function} onRowClick - Optional row click handler
 * @param {string} keyField - Unique key from data (default: 'id')
 */
const BackboneTable = ({ 
    columns = [], 
    data = [], 
    loading = false, 
    onRowClick,
    keyField = 'id',
    className = ""
}) => {
    
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                    <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">No Data Available</h3>
                <p className="text-xs text-gray-400">There are no records to display at this time.</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full border-collapse">
                    {/* Header */}
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100">
                            {columns.map((col, idx) => {
                                // Extract alignment to apply to header as well
                                const alignClass = col.className?.includes('text-right') ? 'text-right' : 
                                                 col.className?.includes('text-center') ? 'text-center' : 'text-left';
                                return (
                                    <th 
                                        key={idx}
                                        className={`px-6 py-4 ${alignClass} text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 ${col.hiddenMobile ? 'hidden md:table-cell' : ''} ${col.className || ''}`}
                                    >
                                        {col.header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-gray-50">
                        {data.map((item, rowIdx) => (
                            <tr 
                                key={item[keyField] || rowIdx}
                                onClick={(e) => {
                                    // Don't trigger row click if clicking on a button, link, or interactive element
                                    if (onRowClick && !e.target.closest('button, a, input, select')) {
                                        onRowClick(item);
                                    }
                                }}
                                className={`group transition-all duration-200 hover:bg-blue-50/30 ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col, colIdx) => (
                                    <td 
                                        key={colIdx}
                                        className={`px-6 py-4 text-sm ${col.hiddenMobile ? 'hidden md:table-cell' : ''} ${col.className || ''}`}
                                    >
                                        <div className="flex items-center">
                                            {col.render ? col.render(item) : (
                                                <span className="font-semibold text-gray-700">
                                                    {col.accessor.split('.').reduce((obj, key) => obj?.[key], item) || '—'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                ))}
                                
                                {onRowClick && (
                                    <td className="px-4 py-4 text-right">
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile Footer Info */}
            <div className="md:hidden px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Showing {data.length} records
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Scroll Right <ChevronRight size={10} />
                </span>
            </div>
        </div>
    );
};

export default BackboneTable;

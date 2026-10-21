

// src/POS/Reports/components/TransposedTable.jsx
import React, {useState, useEffect} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {formatValue} from '../config/sections';
import BusinessNotePanel from './BusinessNotePanel';

// Simple mobile detection hook
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);
    return isMobile;
};

const TransposedTable = ({
                             rows,
                             columns,
                             renderCell,
                             aggregated,
                             onAddNote,
                             selectedRowKey,
                             onRowSelect,
                             selectedFieldKey,
                             onFieldSelect,
                             rowLabelKey = 'period_key',
                         }) => {
    const [expandedNoteCol, setExpandedNoteCol] = useState(null);
    const isMobile = useIsMobile();

    if (!rows?.length || !columns?.length) return null;

    const isSummable = (type) => ['currency', 'int', 'number'].includes(type);

    // ═══════════════════════════════════════════════════════════════
    // 📱 MOBILE VIEW — Period Cards
    // ═══════════════════════════════════════════════════════════════
    if (isMobile) {
        return (
            <div style={{
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
            }}>
                {rows.map((row, ri) => {
                    const rowKey = row[rowLabelKey] || row.id || ri;
                    const isSelected = selectedRowKey === rowKey;
                    const isExpanded = expandedNoteCol === rowKey;
                    const notesCount = (row.business_notes || []).length;

                    return (
                        <div key={rowKey} style={{
                            borderRadius: 10,
                            border: `1.5px solid ${isSelected ? '#0ea5e9' : '#e2e8f0'}`,
                            background: 'white',
                            overflow: 'hidden',
                        }}>
                            {/* Period header */}
                            <div
                                onClick={() => onRowSelect?.(isSelected ? null : rowKey)}
                                style={{
                                    padding: '10px 14px',
                                    background: isSelected ? '#dbeafe' : '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #e2e8f0',
                                }}
                            >
                                <div style={{
                                    fontWeight: 800,
                                    color: isSelected ? '#0284c7' : '#0f172a',
                                    fontSize: 13,
                                }}>
                                    {row[rowLabelKey] || row.product_name || row.id || `#${ri + 1}`}
                                </div>
                                {onAddNote && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedNoteCol(isExpanded ? null : rowKey);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: 11,
                                            color: notesCount > 0 ? '#0284c7' : '#94a3b8',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            padding: 0,
                                        }}
                                    >
                                        📝 {notesCount > 0 ? `${notesCount} note${notesCount > 1 ? 's' : ''}` : 'Notes'}
                                        {isExpanded ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                                    </button>
                                )}
                            </div>

                            {/* Field : Value list */}
                            <div>
                                {columns.map((col, ci) => (
                                    <div key={col.key} style={{
                                        padding: '8px 14px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        borderBottom: ci < columns.length - 1 ? '1px dashed #f1f5f9' : 'none',
                                        background: ci % 2 === 1 ? '#fafbfc' : 'white',
                                    }}>
                                        <div style={{
                                            fontSize: 12,
                                            color: '#64748b',
                                            fontWeight: 600,
                                            flex: 1,
                                            minWidth: 0,
                                        }}>
                                            {col.label}
                                        </div>
                                        <div style={{
                                            fontSize: 13,
                                            color: '#0f172a',
                                            fontWeight: 700,
                                            textAlign: 'right',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {renderCell(row, col)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Notes panel */}
                            {isExpanded && onAddNote && (
                                <BusinessNotePanel
                                    notes={row.business_notes || []}
                                    onAddNote={(text) => onAddNote(row, text)}
                                    canEdit={true}
                                />
                            )}
                        </div>
                    );
                })}

                {/* Mobile total card */}
                {aggregated && (
                    <div style={{
                        borderRadius: 10,
                        border: '2px solid #f59e0b',
                        background: '#fffbeb',
                        overflow: 'hidden',
                        marginTop: 4,
                    }}>
                        <div style={{
                            padding: '10px 14px',
                            background: '#fef3c7',
                            fontWeight: 800,
                            color: '#92400e',
                            fontSize: 13,
                            borderBottom: '1px solid #fcd34d',
                        }}>
                            ⊕ TOTAL
                        </div>
                        <div>
                            {columns.map((col, ci) => {
                                const show = isSummable(col.type) && aggregated[col.key] !== undefined;
                                if (!show) return null;
                                return (
                                    <div key={col.key} style={{
                                        padding: '8px 14px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        borderBottom: '1px dashed #fde68a',
                                    }}>
                                        <div style={{fontSize: 12, color: '#92400e', fontWeight: 600}}>
                                            {col.label}
                                        </div>
                                        <div style={{fontSize: 13, color: '#78350f', fontWeight: 800}}>
                                            {formatValue(aggregated[col.key], col.type)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════
    // 💻 DESKTOP VIEW — Transposed Table
    // ═══════════════════════════════════════════════════════════════
    return (
        <div style={{
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: '65vh',
            minHeight: 200,
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
            }}>
                <thead>
                <tr style={{
                    background: '#f8fafc',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5,
                }}>
                    {/* Corner */}
                    <th style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontWeight: 700,
                        color: '#475569',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        borderBottom: '1px solid #e2e8f0',
                        borderRight: '1px solid #e2e8f0',
                        position: 'sticky',
                        left: 0,
                        background: '#f8fafc',
                        zIndex: 6,
                        minWidth: 200,
                    }}>
                        Field
                    </th>

                    {/* Period headers — click to select period */}
                    {rows.map((row, ri) => {
                        const rowKey = row[rowLabelKey] || row.id || ri;
                        const isSelected = selectedRowKey === rowKey;
                        const hasNotes = (row.business_notes || []).length > 0;

                        return (
                            <th key={rowKey} style={{
                                padding: '10px 14px',
                                textAlign: 'right',
                                fontWeight: isSelected ? 800 : 700,
                                color: isSelected ? '#0284c7' : '#475569',
                                fontSize: 11,
                                textTransform: 'uppercase',
                                letterSpacing: '0.03em',
                                borderBottom: isSelected ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                                whiteSpace: 'nowrap',
                                minWidth: 130,
                                background: isSelected ? '#eff6ff' : '#f8fafc',
                                cursor: 'pointer',
                            }}
                                onClick={() => onRowSelect?.(isSelected ? null : rowKey)}
                                title="Click to select period for PDF export"
                            >
                                {row[rowLabelKey] || row.product_name || row.id || `#${ri + 1}`}
                                {hasNotes && (
                                    <span style={{
                                        marginLeft: 5,
                                        fontSize: 9,
                                        color: '#0ea5e9',
                                        fontWeight: 700,
                                    }}>
                                            📝{row.business_notes.length}
                                        </span>
                                )}
                            </th>
                        );
                    })}

                    {/* TOTAL header */}
                    <th style={{
                        padding: '10px 14px',
                        textAlign: 'right',
                        fontWeight: 800,
                        color: '#0f172a',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        borderBottom: '2px solid #0f172a',
                        borderLeft: '2px solid #0f172a',
                        whiteSpace: 'nowrap',
                        minWidth: 130,
                        background: '#fef3c7',
                        position: 'sticky',
                        right: 0,
                        zIndex: 4,
                    }}>
                        Total
                    </th>
                </tr>
                </thead>
                <tbody>
                {columns.map((col, ci) => {
                    const isZebraDark = ci % 2 === 1;
                    const isFieldSelected = selectedFieldKey === col.key;

                    return (
                        <tr
                            key={col.key}
                            style={{
                                borderBottom: '1px solid #f1f5f9',
                                background: isFieldSelected
                                    ? '#f0f9ff'
                                    : isZebraDark ? '#fafbfc' : 'white',
                            }}
                        >
                            {/* Field label — click to select field */}
                            <td
                                onClick={() => onFieldSelect?.(isFieldSelected ? null : col.key)}
                                style={{
                                    padding: '10px 14px',
                                    fontWeight: 600,
                                    color: isFieldSelected ? '#0284c7' : '#475569',
                                    background: isFieldSelected
                                        ? '#dbeafe'
                                        : isZebraDark ? '#f5f6f8' : '#fafafa',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 2,
                                    minWidth: 200,
                                    borderRight: isFieldSelected
                                        ? '2px solid #0ea5e9'
                                        : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                }}
                                title="Click to select this field"
                            >
                                {col.label}
                            </td>

                            {rows.map((row, ri) => {
                                const rowKey = row[rowLabelKey] || row.id || ri;
                                const isRowSelected = selectedRowKey === rowKey;
                                const isIntersection = isFieldSelected && isRowSelected;
                                return (
                                    <td key={ri} style={{
                                        padding: '10px 14px',
                                        textAlign: 'right',
                                        color: '#1e293b',
                                        whiteSpace: 'nowrap',
                                        background: isIntersection
                                            ? '#bae6fd'
                                            : isRowSelected ? '#f0f9ff'
                                                : isFieldSelected ? '#f0f9ff'
                                                    : 'transparent',
                                        fontWeight: isIntersection ? 800 : 400,
                                    }}>
                                        {renderCell(row, col)}
                                    </td>
                                );
                            })}

                            {/*/!* TOTAL cell *!/*/}
                            {/*<td style={{*/}
                            {/*    padding: '10px 14px',*/}
                            {/*    textAlign: 'right',*/}
                            {/*    color: '#0f172a',*/}
                            {/*    fontWeight: 800,*/}
                            {/*    whiteSpace: 'nowrap',*/}
                            {/*    background: '#fffbeb',*/}
                            {/*    borderLeft: '2px solid #0f172a',*/}
                            {/*    position: 'sticky',*/}
                            {/*    right: 0,*/}
                            {/*    zIndex: 3,*/}
                            {/*}}>*/}
                            {/*    {isSummable(col.type) && aggregated?.[col.key] !== undefined*/}
                            {/*        ? formatValue(aggregated[col.key], col.type)*/}
                            {/*        : '—'}*/}
                            {/*</td>*/}


                            {/* TOTAL cell */}
                            <td style={{
                                padding: '10px 14px',
                                textAlign: 'right',
                                // color: isFieldSelected ? 'white' : '#0f172a',              // ← নতুন
                                color: '#0f172a',              // ← নতুন
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                // background: isFieldSelected ? '#0284c7' : '#fffbeb',       // ← নতুন (highlight)
                                background: isFieldSelected ? '#bae6fd' : '#fffbeb',       // ← নতুন (highlight)
                                borderLeft: '2px solid #0f172a',
                                position: 'sticky',
                                right: 0,
                                zIndex: 3,
                                transition: 'background 0.15s, color 0.15s',
                            }}>
                                {isSummable(col.type) && aggregated?.[col.key] !== undefined
                                    ? formatValue(aggregated[col.key], col.type)
                                    : '—'}
                            </td>

                        </tr>
                    );
                })}

                {/* Notes expander row */}
                {onAddNote && (
                    <tr style={{borderTop: '2px dashed #cbd5e1'}}>
                        <td style={{
                            padding: '10px 14px',
                            fontWeight: 700,
                            color: '#0ea5e9',
                            background: '#f0f9ff',
                            position: 'sticky',
                            left: 0,
                            zIndex: 2,
                            borderRight: '1px solid #e2e8f0',
                        }}>
                            📝 Notes
                        </td>
                        {rows.map((row, ri) => {
                            const rowKey = row[rowLabelKey] || row.id || ri;
                            const notesCount = (row.business_notes || []).length;
                            const isExpanded = expandedNoteCol === rowKey;
                            return (
                                <td
                                    key={ri}
                                    style={{
                                        padding: '8px 10px',
                                        textAlign: 'center',
                                        background: '#f0f9ff',
                                        cursor: 'pointer',
                                        borderLeft: '1px solid #f1f5f9',
                                    }}
                                    onClick={() => setExpandedNoteCol(isExpanded ? null : rowKey)}
                                >
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        fontSize: 11,
                                        color: notesCount > 0 ? '#0284c7' : '#94a3b8',
                                        fontWeight: 600,
                                    }}>
                                        {notesCount > 0 ? `${notesCount} note${notesCount > 1 ? 's' : ''}` : '+ Add'}
                                        {isExpanded ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                                    </div>
                                </td>
                            );
                        })}
                        <td style={{
                            background: '#fffbeb',
                            borderLeft: '2px solid #0f172a',
                        }}></td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Expanded notes panel */}
            {expandedNoteCol && onAddNote && (() => {
                const expandRow = rows.find((r, ri) => {
                    const rk = r[rowLabelKey] || r.id || ri;
                    return rk === expandedNoteCol;
                });
                if (!expandRow) return null;

                return (
                    <div style={{
                        background: 'white',
                        borderTop: '1px solid #e2e8f0',
                    }}>
                        <div style={{
                            padding: '8px 16px',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#475569',
                            background: '#f8fafc',
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                            borderBottom: '1px solid #e2e8f0',
                        }}>
                            Notes for {expandedNoteCol}
                        </div>
                        <BusinessNotePanel
                            notes={expandRow.business_notes || []}
                            onAddNote={(text) => onAddNote(expandRow, text)}
                            canEdit={true}
                        />
                    </div>
                );
            })()}
        </div>
    );
};

export default TransposedTable;
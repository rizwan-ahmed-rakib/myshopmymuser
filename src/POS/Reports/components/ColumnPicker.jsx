// src/POS/Reports/components/ColumnPicker.jsx
import React, { useState, useMemo } from 'react';
import { X, Settings2, Search } from 'lucide-react';
import { SECTION_META } from '../config/columns';

/**
 * Column Picker Modal — user custom columns select করতে পারে।
 * localStorage-এ save হয় (provider-এর মাধ্যমে)।
 */
const ColumnPicker = ({
    isOpen, onClose,
    allColumns,
    selectedKeys,
    onChange,   // (nextKeys[]) => void
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [localSelected, setLocalSelected] = useState(() => new Set(selectedKeys || []));

    // Section অনুযায়ী group
    const groupedColumns = useMemo(() => {
        const groups = {};
        allColumns.forEach((col) => {
            if (!groups[col.section]) groups[col.section] = [];
            groups[col.section].push(col);
        });
        return groups;
    }, [allColumns]);

    // Search filter
    const filteredGroups = useMemo(() => {
        if (!searchTerm.trim()) return groupedColumns;
        const term = searchTerm.toLowerCase();
        const out = {};
        Object.entries(groupedColumns).forEach(([section, cols]) => {
            const filtered = cols.filter(
                (c) =>
                    c.label.toLowerCase().includes(term) ||
                    c.key.toLowerCase().includes(term)
            );
            if (filtered.length) out[section] = filtered;
        });
        return out;
    }, [groupedColumns, searchTerm]);

    const toggle = (key) => {
        setLocalSelected((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const toggleSection = (section) => {
        const keys = groupedColumns[section]?.map((c) => c.key) || [];
        const allOn = keys.every((k) => localSelected.has(k));
        setLocalSelected((prev) => {
            const next = new Set(prev);
            keys.forEach((k) => {
                if (allOn) next.delete(k);
                else next.add(k);
            });
            return next;
        });
    };

    const handleApply = () => {
        onChange(Array.from(localSelected));
        onClose();
    };

    const handleReset = () => {
        const defaults = allColumns.filter((c) => c.default).map((c) => c.key);
        setLocalSelected(new Set(defaults));
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: 16,
                    width: '100%',
                    maxWidth: 640,
                    maxHeight: '88vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <Settings2 size={18} color="#0ea5e9" />
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        Manage Columns
                    </h2>
                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>
                        {localSelected.size} selected
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', color: '#64748b',
                            padding: 6, borderRadius: 6,
                            marginLeft: 'auto',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search + actions */}
                <div style={{
                    padding: '10px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex', gap: 8, alignItems: 'center',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        flex: 1,
                        background: '#f8fafc',
                        borderRadius: 8,
                        padding: '6px 10px',
                        border: '1px solid #e2e8f0',
                    }}>
                        <Search size={14} color="#94a3b8" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search columns..."
                            style={{
                                border: 'none', background: 'transparent',
                                outline: 'none', fontSize: 12.5,
                                width: '100%', color: '#1e293b',
                            }}
                        />
                    </div>
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '5px 10px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: 7,
                            fontSize: 11.5, color: '#64748b',
                            cursor: 'pointer', fontWeight: 600,
                        }}
                    >
                        Reset Default
                    </button>
                </div>

                {/* Columns list */}
                <div style={{ padding: '12px 20px', overflowY: 'auto', flex: 1 }}>
                    {Object.entries(filteredGroups).map(([section, cols]) => {
                        const meta = SECTION_META[section] || { label: section, icon: '📋' };
                        const allOn = cols.every((c) => localSelected.has(c.key));
                        return (
                            <div key={section} style={{ marginBottom: 14 }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    marginBottom: 6,
                                    paddingBottom: 4,
                                    borderBottom: '1px dashed #e2e8f0',
                                }}>
                                    <span style={{ fontSize: 14 }}>{meta.icon}</span>
                                    <span style={{
                                        fontSize: 12, fontWeight: 700,
                                        color: '#475569',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                    }}>
                                        {meta.label}
                                    </span>
                                    <span style={{
                                        fontSize: 10, color: '#94a3b8',
                                        marginLeft: 4,
                                    }}>
                                        ({cols.length})
                                    </span>
                                    <button
                                        onClick={() => toggleSection(section)}
                                        style={{
                                            marginLeft: 'auto',
                                            background: 'none', border: 'none',
                                            fontSize: 11, color: '#0ea5e9',
                                            fontWeight: 600, cursor: 'pointer',
                                        }}
                                    >
                                        {allOn ? 'Clear' : 'Select All'}
                                    </button>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: 4,
                                }}>
                                    {cols.map((col) => {
                                        const isOn = localSelected.has(col.key);
                                        return (
                                            <label
                                                key={col.key}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    padding: '5px 8px',
                                                    borderRadius: 6,
                                                    background: isOn ? '#eff6ff' : 'transparent',
                                                    cursor: 'pointer',
                                                    fontSize: 12,
                                                    color: isOn ? '#0284c7' : '#475569',
                                                    fontWeight: isOn ? 600 : 400,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isOn}
                                                    onChange={() => toggle(col.key)}
                                                    style={{ accentColor: '#0ea5e9' }}
                                                />
                                                <span>{col.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    {Object.keys(filteredGroups).length === 0 && (
                        <div style={{
                            textAlign: 'center', padding: 30,
                            color: '#94a3b8', fontSize: 12.5,
                        }}>
                            কোনো column match করছে না
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex', gap: 8, justifyContent: 'flex-end',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '7px 14px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            fontSize: 12.5, color: '#64748b',
                            cursor: 'pointer', fontWeight: 600,
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            padding: '7px 14px',
                            background: '#0ea5e9',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 12.5, color: 'white',
                            cursor: 'pointer', fontWeight: 700,
                        }}
                    >
                        Apply ({localSelected.size})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColumnPicker;
// src/POS/Reports/components/BusinessNotePanel.jsx
import React, { useState } from 'react';
import { Plus, X, Check, Loader2, User, Clock } from 'lucide-react';

/**
 * BusinessNotePanel — প্রতি row-এর নিচে notes দেখানো + নতুন note যোগ করা।
 *
 * Props:
 * - notes: array of { note, by_id, by_name, by_role, at }
 * - onAddNote: (noteText) => Promise — backend PATCH call
 * - canEdit: boolean — permission থেকে
 */
const BusinessNotePanel = ({ notes = [], onAddNote, canEdit = true }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!noteText.trim()) return;
        setSaving(true);
        setError('');
        try {
            await onAddNote(noteText.trim());
            setNoteText('');
            setIsAdding(false);
        } catch (err) {
            setError(err?.response?.data?.detail || 'Failed to save note');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setNoteText('');
        setError('');
        setIsAdding(false);
    };

    return (
        <div style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 20px',
        }}>
            {/* Notes list */}
            {notes.length === 0 && !isAdding && (
                <div style={{
                    fontSize: 12.5,
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    📝 No business notes yet
                    {canEdit && (
                        <button
                            onClick={() => setIsAdding(true)}
                            style={{
                                background: 'none', border: 'none',
                                color: '#0ea5e9', cursor: 'pointer',
                                fontWeight: 600, fontSize: 12.5,
                                textDecoration: 'underline',
                            }}
                        >
                            Add one
                        </button>
                    )}
                </div>
            )}

            {notes.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    marginBottom: isAdding ? 12 : 0,
                }}>
                    {notes.map((n, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                gap: 10,
                                padding: '8px 12px',
                                background: 'white',
                                borderRadius: 8,
                                borderLeft: '3px solid #0ea5e9',
                            }}
                        >
                            <div style={{
                                flex: 1,
                                minWidth: 0,
                            }}>
                                <div style={{
                                    fontSize: 13,
                                    color: '#0f172a',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    marginBottom: 4,
                                }}>
                                    {n.note}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: 12,
                                    alignItems: 'center',
                                    fontSize: 11,
                                    color: '#94a3b8',
                                }}>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: 3,
                                    }}>
                                        <User size={10} />
                                        {n.by_name || 'Unknown'}
                                        {n.by_role && (
                                            <span style={{
                                                background: '#f1f5f9',
                                                color: '#64748b',
                                                fontSize: 9,
                                                fontWeight: 700,
                                                padding: '1px 5px',
                                                borderRadius: 99,
                                                marginLeft: 3,
                                                textTransform: 'uppercase',
                                            }}>
                                                {String(n.by_role).replace('_', ' ')}
                                            </span>
                                        )}
                                    </span>
                                    {n.at && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Clock size={10} />
                                            {new Date(n.at).toLocaleString('en-BD', {
                                                dateStyle: 'medium', timeStyle: 'short',
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add note — inline editor */}
            {canEdit && !isAdding && notes.length > 0 && (
                <button
                    onClick={() => setIsAdding(true)}
                    style={{
                        marginTop: 8,
                        padding: '5px 12px',
                        background: 'white',
                        border: '1px dashed #cbd5e1',
                        borderRadius: 8,
                        color: '#64748b',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                    }}
                >
                    <Plus size={12} /> Add Note
                </button>
            )}

            {canEdit && isAdding && (
                <div style={{ marginTop: 8 }}>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="এই দিন/মাসে কী ঘটেছিল? (যেমন: ঈদের ছুটি, দোকান বন্ধ, বন্যা ইত্যাদি)"
                        autoFocus
                        rows={2}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            fontSize: 13,
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            background: 'white',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') handleCancel();
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSave();
                        }}
                    />
                    {error && (
                        <div style={{
                            color: '#dc2626',
                            fontSize: 11.5,
                            marginTop: 4,
                        }}>
                            {error}
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        gap: 6,
                        marginTop: 6,
                        // justifyContent: 'flex-end',
                        justifyContent: 'flex-start',
                    }}>
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            style={{
                                padding: '5px 12px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: 7,
                                fontSize: 12,
                                color: '#64748b',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}
                        >
                            <X size={12} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !noteText.trim()}
                            style={{
                                padding: '5px 12px',
                                background: saving || !noteText.trim() ? '#94a3b8' : '#0ea5e9',
                                border: 'none',
                                borderRadius: 7,
                                fontSize: 12,
                                color: 'white',
                                fontWeight: 600,
                                cursor: saving || !noteText.trim() ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}
                        >
                            {saving ? (
                                <><Loader2 size={12} className="animate-spin" /> Saving...</>
                            ) : (
                                <><Check size={12} /> Save</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessNotePanel;
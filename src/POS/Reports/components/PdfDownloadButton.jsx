// src/POS/Reports/components/PdfDownloadButton.jsx
import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';

const PdfDownloadButton = ({ onDownload, label = 'PDF' }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClick = async () => {
        setLoading(true);
        setError('');
        try {
            await onDownload();
        } catch (err) {
            console.error('PDF error:', err);
            setError('PDF download failed');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleClick}
                disabled={loading}
                style={{
                    padding: '6px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    background: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#475569',
                    fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 5,
                }}
            >
                {loading ? (
                    <><Loader2 size={13} className="animate-spin" /> Generating...</>
                ) : (
                    // <><FileDown size={13} /> PDF</>
                    <><FileDown size={13} /> {label}</>
                )}
            </button>
            {error && (
                <div style={{
                    position: 'absolute', top: '110%', right: 0,
                    background: '#fef2f2', color: '#991b1b',
                    padding: '4px 8px', borderRadius: 6,
                    fontSize: 11, whiteSpace: 'nowrap',
                    border: '1px solid #fecaca',
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default PdfDownloadButton;
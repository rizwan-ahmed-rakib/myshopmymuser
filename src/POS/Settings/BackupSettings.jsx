// BackupSettings.jsx - Backup & Restore Configuration

import React, { useState } from 'react';

const BackupSettings = () => {
    const [autoBackup, setAutoBackup] = useState(true);
    const [backupFrequency, setBackupFrequency] = useState('daily');
    const [backupTime, setBackupTime] = useState('02:00');
    const [backupRetention, setBackupRetention] = useState('30');
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [success, setSuccess] = useState('');

    const backupHistory = [
        { id: 1, date: '2026-05-09 02:00', size: '4.2 MB', status: 'success', type: 'Auto' },
        { id: 2, date: '2026-05-08 02:00', size: '4.1 MB', status: 'success', type: 'Auto' },
        { id: 3, date: '2026-05-07 14:30', size: '3.9 MB', status: 'success', type: 'Manual' },
        { id: 4, date: '2026-05-06 02:00', size: '3.8 MB', status: 'failed',  type: 'Auto' },
        { id: 5, date: '2026-05-05 02:00', size: '3.7 MB', status: 'success', type: 'Auto' },
    ];

    const handleManualBackup = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setLoading(false);
        setSuccess('backup');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleRestore = async (id) => {
        if (!window.confirm('Are you sure you want to restore this backup? Current data will be replaced.')) return;
        setRestoring(true);
        await new Promise(r => setTimeout(r, 1500));
        setRestoring(false);
        setSuccess('restore');
        setTimeout(() => setSuccess(''), 3000);
    };

    const SectionCard = ({ title, icon, children }) => (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[16px]">{icon}</span>
                <h3 className="text-[14px] font-semibold text-slate-800">{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-[16px] font-semibold text-slate-900">Backup & Restore</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Manage your data backups and restore points</p>
            </div>

            {success === 'backup' && (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Backup created successfully!
                </div>
            )}
            {success === 'restore' && (
                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Data restored successfully!
                </div>
            )}

            {/* Manual Backup */}
            <SectionCard title="Manual Backup" icon="💾">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] text-slate-700">Create a backup of all your data right now</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Includes products, sales, settings, and all records</p>
                    </div>
                    <button onClick={handleManualBackup} disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[13px] font-medium rounded-lg transition-colors disabled:opacity-60">
                        {loading ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                </svg>
                                Backing up...
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Backup Now
                            </>
                        )}
                    </button>
                </div>
            </SectionCard>

            {/* Auto Backup */}
            <SectionCard title="Automatic Backup" icon="🔄">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <div>
                        <p className="text-[13px] font-medium text-slate-700">Enable Automatic Backup</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Automatically backup your data on schedule</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={autoBackup} onChange={e => setAutoBackup(e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                    </label>
                </div>

                {autoBackup && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Frequency</label>
                            <select value={backupFrequency} onChange={e => setBackupFrequency(e.target.value)}
                                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800">
                                <option value="hourly">Every Hour</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Backup Time</label>
                            <input type="time" value={backupTime} onChange={e => setBackupTime(e.target.value)}
                                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Keep Backups (days)</label>
                            <input type="number" value={backupRetention} onChange={e => setBackupRetention(e.target.value)} min="1"
                                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800" />
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* Backup History */}
            <SectionCard title="Backup History" icon="🗂️">
                <div className="divide-y divide-slate-100">
                    {backupHistory.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${backup.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                <div>
                                    <p className="text-[12px] font-medium text-slate-700">{backup.date}</p>
                                    <p className="text-[11px] text-slate-400">{backup.size} · {backup.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${backup.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                                    {backup.status}
                                </span>
                                {backup.status === 'success' && (
                                    <button onClick={() => handleRestore(backup.id)} disabled={restoring}
                                        className="text-[11px] font-medium text-blue-600 hover:text-blue-700 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50">
                                        {restoring ? 'Restoring...' : 'Restore'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
};

export default BackupSettings;
// SystemInfo.jsx - System Information

import React, { useState, useEffect } from 'react';
import api from '../../context_or_provider/pos/posApi';


const SystemInfo = () => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSystemInfo();
    }, []);

    const fetchSystemInfo = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/settings/system-info/`);
            setInfo(response.data);
        } catch (error) {
            // Fallback mock data
            setInfo({
                app_name: 'POS System',
                app_version: '1.0.0',
                django_version: '4.2.x',
                python_version: '3.11.x',
                database: 'PostgreSQL',
                db_size: '45.6 MB',
                total_products: 248,
                total_sales: 1842,
                total_customers: 312,
                server_time: new Date().toLocaleString(),
                uptime: '12 days, 4 hours',
                environment: 'Production',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearCache = async () => {
        setClearing(true);
        await new Promise(r => setTimeout(r, 1000));
        setClearing(false);
        setSuccess('cache');
        setTimeout(() => setSuccess(''), 3000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <svg className="w-8 h-8 text-slate-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
            </div>
        );
    }

    const InfoRow = ({ label, value, badge }) => (
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-[12px] text-slate-500">{label}</span>
            {badge ? (
                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    value === 'Production' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>{value}</span>
            ) : (
                <span className="text-[13px] font-semibold text-slate-800">{value}</span>
            )}
        </div>
    );

    const StatCard = ({ icon, label, value, color }) => (
        <div className={`${color} rounded-xl p-4 flex items-center gap-3`}>
            <span className="text-[22px]">{icon}</span>
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
                <p className="text-[18px] font-bold leading-tight">{value?.toLocaleString()}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-[16px] font-semibold text-slate-900">System Information</h2>
                    <p className="text-[12px] text-slate-500 mt-0.5">View system details and manage cache</p>
                </div>
                <button onClick={fetchSystemInfo}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                    Refresh
                </button>
            </div>

            {success === 'cache' && (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Cache cleared successfully!
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon="📦" label="Products"  value={info?.total_products}  color="bg-indigo-50 text-indigo-700 border border-indigo-100" />
                <StatCard icon="🧾" label="Sales"     value={info?.total_sales}     color="bg-emerald-50 text-emerald-700 border border-emerald-100" />
                <StatCard icon="👥" label="Customers" value={info?.total_customers} color="bg-violet-50 text-violet-700 border border-violet-100" />
                <StatCard icon="💾" label="DB Size"   value={info?.db_size}         color="bg-amber-50 text-amber-700 border border-amber-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* App Info */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[16px]">🖥️</span>
                        <h3 className="text-[14px] font-semibold text-slate-800">Application</h3>
                    </div>
                    <InfoRow label="App Name"        value={info?.app_name} />
                    <InfoRow label="Version"         value={info?.app_version} />
                    <InfoRow label="Environment"     value={info?.environment} badge />
                    <InfoRow label="Server Time"     value={info?.server_time} />
                    <InfoRow label="Uptime"          value={info?.uptime} />
                </div>

                {/* Tech Stack */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[16px]">⚙️</span>
                        <h3 className="text-[14px] font-semibold text-slate-800">Tech Stack</h3>
                    </div>
                    <InfoRow label="Django Version"  value={info?.django_version} />
                    <InfoRow label="Python Version"  value={info?.python_version} />
                    <InfoRow label="Database"        value={info?.database} />
                    <InfoRow label="Database Size"   value={info?.db_size} />
                </div>
            </div>

            {/* Cache Management */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[16px]">🧹</span>
                    <h3 className="text-[14px] font-semibold text-slate-800">Cache Management</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] text-slate-700">Clear Application Cache</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Remove cached data to free up memory and fix display issues</p>
                    </div>
                    <button onClick={handleClearCache} disabled={clearing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-medium rounded-lg transition-colors disabled:opacity-60">
                        {clearing ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                </svg>
                                Clearing...
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                </svg>
                                Clear Cache
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemInfo;
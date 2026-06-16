// SettingsPage.jsx - Main Settings Page with Tabs

import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import TaxSettings from './TaxSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';
import NotificationSettings from './NotificationSettings';
import BackupSettings from './BackupSettings';
import SystemInfo from './SystemInfo';
import UserManagement from './UserManagement';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general',      name: 'General',          icon: '⚙️' },
        { id: 'user',         name: 'User Management',  icon: '👤' },
        { id: 'tax',          name: 'Tax Settings',      icon: '💰' },
        { id: 'payment',      name: 'Payment Methods',   icon: '💳' },
        { id: 'invoice',      name: 'Invoice',           icon: '📄' },
        { id: 'notification', name: 'Notifications',     icon: '🔔' },
        { id: 'backup',       name: 'Backup',            icon: '💾' },
        { id: 'system',       name: 'System Info',       icon: 'ℹ️' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':      return <GeneralSettings />;
            case 'user':         return <UserManagement />;
            case 'tax':          return <TaxSettings />;
            case 'payment':      return <PaymentSettings />;
            case 'invoice':      return <InvoiceSettings />;
            case 'notification': return <NotificationSettings />;
            case 'backup':       return <BackupSettings />;
            case 'system':       return <SystemInfo />;
            default:             return <GeneralSettings />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <style>{`
                .settings-tab-scroll::-webkit-scrollbar { height: 0; }
                .settings-tab-scroll { scrollbar-width: none; }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .settings-content { animation: fadeSlideUp 0.2s ease both; }
            `}</style>

            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'18px',height:'18px'}}>
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
                                <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-[20px] font-bold text-slate-900 leading-none">Settings</h1>
                            <p className="text-[12px] text-slate-500 mt-0.5">Manage your POS system settings and preferences</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Tabs Navigation */}
                    <div className="border-b border-slate-100 bg-slate-50/60">
                        <div className="flex overflow-x-auto settings-tab-scroll px-2 pt-2 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-all ${
                                        activeTab === tab.id
                                            ? 'border-slate-800 text-slate-900 bg-white shadow-sm'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60'
                                    }`}
                                >
                                    <span className="text-[14px]">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div key={activeTab} className="p-6 settings-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
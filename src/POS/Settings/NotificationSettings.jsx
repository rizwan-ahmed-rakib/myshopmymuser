// NotificationSettings.jsx - Notification Configuration

import React, { useState } from 'react';

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState({
        low_stock_alert: true,
        low_stock_threshold: '10',
        out_of_stock_alert: true,
        new_sale_alert: false,
        daily_report: true,
        daily_report_time: '20:00',
        expiry_alert: true,
        expiry_days_before: '30',
        email_notifications: true,
        sms_notifications: false,
        notification_email: '',
        notification_phone: '',
    });

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNotifications(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 600));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
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

    const Toggle = ({ name, label, description }) => (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
                <p className="text-[13px] font-medium text-slate-700">{label}</p>
                {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name={name} checked={notifications[name]} onChange={handleChange} className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
            </label>
        </div>
    );

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-[16px] font-semibold text-slate-900">Notification Settings</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Configure alerts and notification preferences</p>
            </div>

            {success && (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Notification settings saved!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Inventory Alerts */}
                <SectionCard title="Inventory Alerts" icon="📦">
                    <Toggle name="low_stock_alert"    label="Low Stock Alert"    description="Get notified when stock falls below threshold" />
                    {notifications.low_stock_alert && (
                        <div className="py-3 border-b border-slate-100">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Low Stock Threshold (units)</label>
                            <input type="number" name="low_stock_threshold" value={notifications.low_stock_threshold} onChange={handleChange} min="1"
                                className="w-full md:w-40 px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800" />
                        </div>
                    )}
                    <Toggle name="out_of_stock_alert" label="Out of Stock Alert"  description="Alert when a product goes out of stock" />
                    <Toggle name="expiry_alert"       label="Expiry Date Alert"   description="Notify before products expire" />
                    {notifications.expiry_alert && (
                        <div className="py-3">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Alert Days Before Expiry</label>
                            <input type="number" name="expiry_days_before" value={notifications.expiry_days_before} onChange={handleChange} min="1"
                                className="w-full md:w-40 px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800" />
                        </div>
                    )}
                </SectionCard>

                {/* Sales Alerts */}
                <SectionCard title="Sales & Reports" icon="📊">
                    <Toggle name="new_sale_alert" label="New Sale Alert"    description="Notify on every new sale transaction" />
                    <Toggle name="daily_report"   label="Daily Sales Report" description="Receive daily summary at set time" />
                    {notifications.daily_report && (
                        <div className="py-3">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Report Time</label>
                            <input type="time" name="daily_report_time" value={notifications.daily_report_time} onChange={handleChange}
                                className="w-full md:w-40 px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800" />
                        </div>
                    )}
                </SectionCard>

                {/* Channels */}
                <SectionCard title="Notification Channels" icon="📡">
                    <Toggle name="email_notifications" label="Email Notifications" description="Receive alerts via email" />
                    {notifications.email_notifications && (
                        <div className="py-3 border-b border-slate-100">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notification Email</label>
                            <input type="email" name="notification_email" value={notifications.notification_email} onChange={handleChange}
                                placeholder="alerts@company.com"
                                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400" />
                        </div>
                    )}
                    <Toggle name="sms_notifications" label="SMS Notifications" description="Receive alerts via SMS" />
                    {notifications.sms_notifications && (
                        <div className="py-3">
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notification Phone</label>
                            <input type="tel" name="notification_phone" value={notifications.notification_phone} onChange={handleChange}
                                placeholder="+880 1XXX-XXXXXX"
                                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400" />
                        </div>
                    )}
                </SectionCard>

                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-[13px] font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors">
                        {loading ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                </svg>
                                Saving...
                            </>
                        ) : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationSettings;
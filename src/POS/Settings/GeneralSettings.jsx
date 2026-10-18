// // GeneralSettings.jsx - Company Information & General Settings
//
// import React, { useState, useEffect } from 'react';
// import { usePosSettings } from '../../context_or_provider/pos/PosSettings/pos_settings_provider';
//
// const GeneralSettings = () => {
//     const { settings: backendSettings, loading: backendLoading, updateSettings } = usePosSettings();
//     const [settings, setSettings] = useState({
//         company_name: '', company_email: '', company_phone: '',
//         company_address: '', company_logo: null,
//         currency: 'BDT', currency_symbol: '৳',
//         timezone: 'Asia/Dhaka', date_format: 'DD/MM/YYYY', time_format: '12',
//     });
//
//     const [logoPreview, setLogoPreview] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);
//
//     useEffect(() => {
//         if (backendSettings) {
//             setSettings(backendSettings);
//             if (backendSettings.company_logo) setLogoPreview(backendSettings.company_logo);
//         }
//     }, [backendSettings]);
//
//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === 'company_logo' && files.length > 0) {
//             const file = files[0];
//             setSettings(prev => ({ ...prev, company_logo: file }));
//             const reader = new FileReader();
//             reader.onloadend = () => setLogoPreview(reader.result);
//             reader.readAsDataURL(file);
//         } else {
//             setSettings(prev => ({ ...prev, [name]: value }));
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); setSuccess(false);
//         try {
//             const formData = new FormData();
//             Object.keys(settings).forEach(key => {
//                 // লোগো যদি নতুন ফাইল হয় তবেই পাঠান
//                 if (key === 'company_logo') {
//                     if (settings[key] instanceof File) {
//                         formData.append(key, settings[key]);
//                     }
//                 } else if (settings[key] !== null && settings[key] !== '') {
//                     formData.append(key, settings[key]);
//                 }
//             });
//             await updateSettings(formData);
//             setSuccess(true);
//             setTimeout(() => setSuccess(false), 3000);
//         } catch (error) {
//             console.error('Error saving settings:', error);
//             alert('Failed to save settings');
//         } finally { setLoading(false); }
//     };
//
//     const SectionCard = ({ title, icon, children }) => (
//         <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//             <div className="flex items-center gap-2 mb-4">
//                 <span className="text-[16px]">{icon}</span>
//                 <h3 className="text-[14px] font-semibold text-slate-800">{title}</h3>
//             </div>
//             {children}
//         </div>
//     );
//
//     const Field = ({ label, name, type = 'text', placeholder, required, as: As = 'input', children }) => (
//         <div>
//             <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//                 {label} {required && <span className="text-rose-400">*</span>}
//             </label>
//             {As === 'select' ? (
//                 <select name={name} value={settings[name]} onChange={handleChange}
//                     className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800">
//                     {children}
//                 </select>
//             ) : (
//                 <input type={type} name={name} value={settings[name]} onChange={handleChange}
//                     placeholder={placeholder} required={required}
//                     className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400" />
//             )}
//         </div>
//     );
//
//     return (
//         <div className="space-y-5">
//             <div>
//                 <h2 className="text-[16px] font-semibold text-slate-900">General Settings</h2>
//                 <p className="text-[12px] text-slate-500 mt-0.5">Configure your company information and system preferences</p>
//             </div>
//
//             {success && (
//                 <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
//                     <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
//                     </svg>
//                     Settings saved successfully!
//                 </div>
//             )}
//
//             <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Logo */}
//                 <SectionCard title="Company Logo" icon="🖼️">
//                     <div className="flex items-center gap-5">
//                         <div className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden bg-white shrink-0">
//                             {logoPreview ? (
//                                 <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
//                             ) : (
//                                 <div className="text-center text-slate-400">
//                                     <svg className="w-8 h-8 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                                         <rect x="3" y="3" width="18" height="18" rx="2"/>
//                                         <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
//                                     </svg>
//                                     <p className="text-[10px]">No Logo</p>
//                                 </div>
//                             )}
//                         </div>
//                         <div>
//                             <input type="file" name="company_logo" id="company_logo" accept="image/*" onChange={handleChange} className="hidden" />
//                             <label htmlFor="company_logo" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-[12px] font-medium rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
//                                 <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
//                                 </svg>
//                                 Upload Logo
//                             </label>
//                             <p className="text-[11px] text-slate-400 mt-2">PNG, JPG, GIF up to 2MB</p>
//                         </div>
//                     </div>
//                 </SectionCard>
//
//                 {/* Company Info */}
//                 <SectionCard title="Company Information" icon="🏢">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <Field label="Company Name" name="company_name" placeholder="Your Company Name" required />
//                         <Field label="Email" name="company_email" type="email" placeholder="info@company.com" required />
//                         <Field label="Phone Number" name="company_phone" type="tel" placeholder="+880 1XXX-XXXXXX" required />
//                         <Field label="Address" name="company_address" placeholder="Company Address" />
//                     </div>
//                 </SectionCard>
//
//                 {/* Regional */}
//                 <SectionCard title="Regional Settings" icon="🌐">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <Field label="Currency" name="currency" as="select">
//                             <option value="BDT">BDT - Bangladeshi Taka</option>
//                             <option value="USD">USD - US Dollar</option>
//                             <option value="EUR">EUR - Euro</option>
//                             <option value="GBP">GBP - British Pound</option>
//                             <option value="INR">INR - Indian Rupee</option>
//                         </Field>
//                         <Field label="Currency Symbol" name="currency_symbol" placeholder="৳" />
//                         <Field label="Timezone" name="timezone" as="select">
//                             <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
//                             <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
//                             <option value="America/New_York">America/New York (GMT-5)</option>
//                             <option value="Europe/London">Europe/London (GMT+0)</option>
//                         </Field>
//                         <Field label="Date Format" name="date_format" as="select">
//                             <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//                             <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//                             <option value="YYYY-MM-DD">YYYY-MM-DD</option>
//                         </Field>
//                         <Field label="Time Format" name="time_format" as="select">
//                             <option value="12">12 Hour (AM/PM)</option>
//                             <option value="24">24 Hour</option>
//                         </Field>
//                     </div>
//                 </SectionCard>
//
//                 {/* Submit */}
//                 <div className="flex justify-end pt-2">
//                     <button type="submit" disabled={loading}
//                         className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-[13px] font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
//                         {loading ? (
//                             <>
//                                 <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                     <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
//                                 </svg>
//                                 Saving...
//                             </>
//                         ) : 'Save Settings'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default GeneralSettings;


// GeneralSettings.jsx - Company Information & General Settings

import React, {useState, useEffect} from 'react';
import {usePosSettings} from '../../context_or_provider/pos/PosSettings/pos_settings_provider';

// ✅ SectionCard বাইরে define করা হলো (stable reference)
const SectionCard = ({title, icon, children}) => (
    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-[16px]">{icon}</span>
            <h3 className="text-[14px] font-semibold text-slate-800">{title}</h3>
        </div>
        {children}
    </div>
);

// ✅ Field বাইরে define করা হলো + value/onChange props + extra props spread
const Field = ({
                   label,
                   name,
                   type = 'text',
                   placeholder,
                   required,
                   value,
                   onChange,
                   as: As = 'input',
                   children,
                   ...rest
               }) => (
    <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {As === 'select' ? (
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800"
                {...rest}
            >
                {children}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400"
                {...rest}
            />
        )}
    </div>
);

const GeneralSettings = () => {
    const {settings: backendSettings, loading: backendLoading, updateSettings} = usePosSettings();

    const [settings, setSettings] = useState({
        company_name: '',
        company_email: '',
        company_phone: '',
        company_address: '',
        company_logo: null,
        currency: 'BDT',
        currency_symbol: '৳',
        timezone: 'Asia/Dhaka',
        date_format: 'DD/MM/YYYY',
        time_format: '12',
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (backendSettings) {
            setSettings(prev => ({...prev, ...backendSettings}));
            if (backendSettings.company_logo) setLogoPreview(backendSettings.company_logo);
        }
    }, [backendSettings]);

    const handleChange = (e) => {
        const {name, value, files} = e.target;

        // ✅ Logo upload
        if (name === 'company_logo' && files && files.length > 0) {
            const file = files[0];
            setSettings(prev => ({...prev, company_logo: file}));
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
            return;
        }

        // ✅ Phone number: শুধু digit (0-9) allow
        if (name === 'company_phone') {
            const onlyDigits = value.replace(/\D/g, ''); // সব non-digit মুছে দেয়
            setSettings(prev => ({...prev, company_phone: onlyDigits}));
            return;
        }

        // ✅ Email: lowercase + trim (optional)
        if (name === 'company_email') {
            setSettings(prev => ({...prev, company_email: value.trim()}));
            return;
        }

        // ✅ বাকি সব field
        setSettings(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const formData = new FormData();
            Object.keys(settings).forEach(key => {
                // লোগো যদি নতুন ফাইল হয় তবেই পাঠান
                if (key === 'company_logo') {
                    if (settings[key] instanceof File) {
                        formData.append(key, settings[key]);
                    }
                } else if (settings[key] !== null && settings[key] !== '') {
                    formData.append(key, settings[key]);
                }
            });
            await updateSettings(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-[16px] font-semibold text-slate-900">General Settings</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                    Configure your company information and system preferences
                </p>
            </div>

            {success && (
                <div
                    className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Settings saved successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Logo */}
                <SectionCard title="Company Logo" icon="🖼️">
                    <div className="flex items-center gap-5">
                        <div
                            className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden bg-white shrink-0">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain"/>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <svg className="w-8 h-8 mx-auto mb-1" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                    <p className="text-[10px]">No Logo</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                name="company_logo"
                                id="company_logo"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="company_logo"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-[12px] font-medium rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Upload Logo
                            </label>
                            <p className="text-[11px] text-slate-400 mt-2">PNG, JPG, GIF up to 2MB</p>
                        </div>
                    </div>
                </SectionCard>

                {/* Company Info */}
                <SectionCard title="Company Information" icon="🏢">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                            label="Company Name"
                            name="company_name"
                            placeholder="Your Company Name"
                            value={settings.company_name}
                            onChange={handleChange}
                            required
                        />
                        <Field
                            label="Email"
                            name="company_email"
                            type="email"
                            placeholder="info@company.com"
                            value={settings.company_email}
                            onChange={handleChange}
                            required
                        />
                        <Field
                            label="Phone Number"
                            name="company_phone"
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={15}
                            placeholder="01XXXXXXXXX"
                            value={settings.company_phone}
                            onChange={handleChange}
                            required
                        />
                        <Field
                            label="Address"
                            name="company_address"
                            placeholder="Company Address"
                            value={settings.company_address}
                            onChange={handleChange}
                        />
                    </div>
                </SectionCard>

                {/* Regional */}
                <SectionCard title="Regional Settings" icon="🌐">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                            label="Currency"
                            name="currency"
                            as="select"
                            value={settings.currency}
                            onChange={handleChange}
                        >
                            <option value="BDT">BDT - Bangladeshi Taka</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </Field>
                        <Field
                            label="Currency Symbol"
                            name="currency_symbol"
                            placeholder="৳"
                            value={settings.currency_symbol}
                            onChange={handleChange}
                        />
                        <Field
                            label="Timezone"
                            name="timezone"
                            as="select"
                            value={settings.timezone}
                            onChange={handleChange}
                        >
                            <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                            <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                            <option value="America/New_York">America/New York (GMT-5)</option>
                            <option value="Europe/London">Europe/London (GMT+0)</option>
                        </Field>
                        <Field
                            label="Date Format"
                            name="date_format"
                            as="select"
                            value={settings.date_format}
                            onChange={handleChange}
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </Field>
                        <Field
                            label="Time Format"
                            name="time_format"
                            as="select"
                            value={settings.time_format}
                            onChange={handleChange}
                        >
                            <option value="12">12 Hour (AM/PM)</option>
                            <option value="24">24 Hour</option>
                        </Field>
                    </div>
                </SectionCard>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-[13px] font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2.5">
                                    <path
                                        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GeneralSettings;
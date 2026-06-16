

import React, {useState, useEffect} from 'react';
import {useUserWithProfile} from '../../context_or_provider/pos/profile/userWithProfile';
import api from '../../context_or_provider/pos/posApi';
import {employeeAPI} from '../../context_or_provider/pos/profile/profileupdate';
import {
    User, Shield, Mail, MapPin, Phone, Camera,
    Lock, CheckCircle, AlertCircle, Eye, EyeOff, Save, Key
} from 'lucide-react';

// Typing Focus Loss Bug দূর করার জন্য PasswordField-কে মূল কম্পোনেন্টের বাইরে ডিফাইন করা হয়েছে[cite: 3]
const PasswordField = ({label, name, value, onChange, showPasswords, setShowPasswords}) => (
    <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Key size={16}/>
            </div>
            <input
                type={showPasswords ? "text" : "password"}
                name={name} value={value} onChange={onChange}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                placeholder="••••••••"
            />
            <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
            >
                {showPasswords ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
        </div>
    </div>
);

const PosUserProfile = () => {
    const {userWith_profile, setUserWith_profile, allProfile} = useUserWithProfile();
    const [activeTab, setActiveTab] = useState('profile');

    // Detailed Profile State[cite: 3]
    const [profileData, setProfileData] = useState({
        id: '',
        name: '',
        email: '',
        address: '',
        phone_number: '',
        role: '',
        profile_picture: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({type: '', text: ''});

    // Fetch and sync full profile data
    useEffect(() => {
        if (allProfile.length > 0 && userWith_profile) {
            const currentUserId = userWith_profile.user_id || (userWith_profile.user && typeof userWith_profile.user === 'object' ? userWith_profile.user.id : userWith_profile.user);
            const fullProfile = allProfile.find(p => {
                const profileUserId = p.user && typeof p.user === 'object' ? p.user.id : p.user;
                return profileUserId && currentUserId && Number(profileUserId) === Number(currentUserId);
            });
            
            if (fullProfile) {
                setProfileData({
                    id: fullProfile.id,
                    name: fullProfile.name || '',
                    email: fullProfile.email || '',
                    address: fullProfile.address || '',
                    phone_number: fullProfile.phone_number || '',
                    role: fullProfile.role || '',
                    profile_picture: null,
                });
                setLogoPreview(fullProfile.profile_picture);
            }
        }
    }, [allProfile, userWith_profile]);

    const handleProfileChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'profile_picture' && files.length > 0) {
            const file = files[0];
            setProfileData(prev => ({...prev, profile_picture: file}));
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setProfileData(prev => ({...prev, [name]: value}));
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({type: '', text: ''});

        try {
            const response = await employeeAPI.update(profileData.id, profileData);
            const updatedUser = {...userWith_profile, ...response.data};
            setUserWith_profile(updatedUser);
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
            setMessage({type: 'success', text: 'Profile updated successfully!'});
        } catch (err) {
            setMessage({type: 'error', text: 'Failed to update profile.'});
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordData.old_password) {
            setMessage({type: 'error', text: 'Please enter your current password.'});
            return;
        }
        if (passwordData.new_password.length < 6) {
            setMessage({type: 'error', text: 'New password must be at least 6 characters.'});
            return;
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({type: 'error', text: 'Passwords do not match!'});
            return;
        }

        setLoading(true);
        try {
            await api.post(`/api/users/change-password/`, {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setMessage({type: 'success', text: 'Password changed successfully!'});
            setPasswordData({old_password: '', new_password: '', confirm_password: ''});
        } catch (err) {
            setMessage({type: 'error', text: err.response?.data?.error || 'Password change failed.'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full bg-[#f8fafc] font-['DM_Sans',sans-serif]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
            `}</style>

            <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
                {/* Header Card */}
                {/*<div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 overflow-hidden mb-6">*/}
                {/*    <div className="h-48 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] relative">*/}
                {/*        <div className="absolute inset-0 bg-black/10" />*/}
                {/*        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row items-center md:items-end gap-6 translate-y-1/2">*/}
                {/*            <div className="relative group">*/}
                {/*                <div className="w-32 h-32 rounded-[24px] border-4 border-white bg-slate-100 shadow-xl overflow-hidden relative">*/}
                {/*                    {logoPreview ? (*/}
                {/*                        <img src={logoPreview} alt="Avatar" className="w-full h-full object-cover" />*/}
                {/*                    ) : (*/}
                {/*                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">*/}
                {/*                            {profileData.name?.substring(0, 2).toUpperCase() || "US"}*/}
                {/*                        </div>*/}
                {/*                    )}*/}
                {/*                    <label htmlFor="p_pic" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">*/}
                {/*                        <Camera className="w-8 h-8 text-white" />*/}
                {/*                    </label>*/}
                {/*                    <input type="file" id="p_pic" name="profile_picture" onChange={handleProfileChange} className="hidden" accept="image/*" />*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="text-center md:text-left mb-2">*/}
                {/*                <h1 className="text-3xl font-extrabold text-white drop-shadow-sm">{profileData.name || 'User Name'}</h1>*/}
                {/*                <p className="text-white/80 font-medium tracking-wide flex items-center justify-center md:justify-start gap-2">*/}
                {/*                    <Shield size={14} />*/}
                {/*                    <span className="capitalize">{profileData.role || 'Member'}</span>*/}
                {/*                </p>*/}
                {/*            </div>*/}

                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="h-20 md:h-16" />*/}
                {/*</div>*/}


                <div className="bg-white rounded-[28px] shadow-lg border border-slate-200/60 overflow-hidden mb-8">

                    {/* Cover Area */}
                    <div
                        className="relative h-56 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 overflow-hidden">

                        {/* Decorative Blur */}
                        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl"/>
                        <div className="absolute bottom-0 left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl"/>

                        <div className="absolute inset-0 bg-black/10"/>
                    </div>

                    {/* Profile Content */}
                    <div className="relative px-8 pb-8">

                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">

                            {/* Avatar */}
                            <div className="relative group shrink-0">
                                <div
                                    className="w-32 h-32 rounded-[28px] border-[5px] border-white bg-slate-100 shadow-2xl overflow-hidden">

                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-slate-400 bg-slate-50">
                                            {profileData.name?.substring(0, 2).toUpperCase() || "US"}
                                        </div>
                                    )}

                                    <label
                                        htmlFor="p_pic"
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                                    >
                                        <Camera className="w-8 h-8 text-white"/>
                                    </label>

                                    <input
                                        type="file"
                                        id="p_pic"
                                        name="profile_picture"
                                        onChange={handleProfileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">

                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                    {profileData.name || "User Name"}
                                </h1>

                                <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                                    <Shield size={16} className="text-indigo-600"/>
                                    <span className="text-slate-600 font-semibold capitalize">
                        {profileData.role || "Member"}
                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">

                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
                        Active Account
                    </span>

                                    <span
                                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                        Verified User
                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Main Component Card */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/60 overflow-hidden">

                    {/* Navigation Tab Systems in Row Format */}
                    <div className="flex border-b border-slate-100 p-2 bg-slate-50/60 gap-1">
                        {[
                            {id: 'profile', label: 'Profile Information', icon: User},
                            {id: 'security', label: 'Security & Password', icon: Lock},
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMessage({type: '', text: ''}); // ট্যাব পরিবর্তনের সময় মেসেজ রিসেট হবে
                                }}
                                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-[#111827] text-white shadow-md'
                                        : 'text-slate-500 hover:bg-white hover:text-slate-900'
                                }`}
                            >
                                <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2}/>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Component Body */}
                    <div className="p-6 md:p-8">

                        {message.text && (
                            <div
                                className={`mb-8 p-4 rounded-[18px] flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top-2 ${
                                    message.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' ? (
                            <form onSubmit={handleProfileSubmit} className="space-y-8">
                                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <User size={16}/>
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label
                                            className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full
                                            Name</label>
                                        <div className="relative group">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <User size={16}/>
                                            </div>
                                            <input
                                                type="text" name="name" value={profileData.name}
                                                onChange={handleProfileChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email
                                            Address</label>
                                        <div className="relative group">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Mail size={16}/>
                                            </div>
                                            <input
                                                type="email" name="email" value={profileData.email}
                                                onChange={handleProfileChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone
                                            Number</label>
                                        <div className="relative">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <Phone size={16}/>
                                            </div>
                                            <input
                                                type="text" value={profileData.phone_number} readOnly
                                                className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current
                                            Address</label>
                                        <div className="relative group">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <MapPin size={16}/>
                                            </div>
                                            <input
                                                type="text" name="address" value={profileData.address}
                                                onChange={handleProfileChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        type="submit" disabled={loading}
                                        className="flex items-center gap-2 bg-[#111827] text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-100"
                                    >
                                        {loading ? <div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> :
                                            <Save size={18}/>}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="max-w-xl space-y-8">
                                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                        <Lock size={16}/>
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                                </div>

                                <div className="space-y-5">
                                    <PasswordField
                                        label="Current Password" name="old_password"
                                        value={passwordData.old_password} onChange={handlePasswordChange}
                                        showPasswords={showPasswords} setShowPasswords={setShowPasswords}
                                    />
                                    <PasswordField
                                        label="New Password" name="new_password"
                                        value={passwordData.new_password} onChange={handlePasswordChange}
                                        showPasswords={showPasswords} setShowPasswords={setShowPasswords}
                                    />
                                    <PasswordField
                                        label="Confirm New Password" name="confirm_password"
                                        value={passwordData.confirm_password} onChange={handlePasswordChange}
                                        showPasswords={showPasswords} setShowPasswords={setShowPasswords}
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        type="submit" disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-[#111827] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-slate-100"
                                    >
                                        {loading ? <div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> :
                                            <Lock size={18}/>}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosUserProfile;
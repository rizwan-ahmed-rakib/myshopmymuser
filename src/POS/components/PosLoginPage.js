import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosAuth } from '../../context_or_provider/pos/PosAuth/PosAuthContext';

const PosLoginPage = () => {
    const { login, requestOTP, verifyOTP, resetPassword, loading, error, setError } = usePosAuth();
    const [view, setView] = useState('login'); // 'login', 'forgot', 'verify', 'reset'
    const [formData, setFormData] = useState({
        phone_number: '',
        password: '',
        email: '',
        otp: '',
        new_password: '',
        confirm_password: ''
    });
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(formData.phone_number, formData.password);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        const result = await requestOTP(formData.email);
        if (result.success) {
            setSuccess('OTP sent to your email!');
            setView('verify');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const result = await verifyOTP(formData.email, formData.otp);
        if (result.success) {
            setSuccess('OTP verified! Now set your new password.');
            setView('reset');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) {
            setError('Passwords do not match!');
            return;
        }
        const result = await resetPassword(formData.phone_number, formData.new_password);
        if (result.success) {
            setSuccess('Password reset successful! You can now login.');
            setView('login');
        }
    };

    const renderHeader = (title, subtitle) => (
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center mx-auto mb-4 rotate-3">
                <span className="text-3xl">🏪</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-[420px] relative">
                {view === 'login' && (
                    <>
                        {renderHeader('Welcome Back', 'Please enter your details to sign in')}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                            <form onSubmit={handleLogin} className="space-y-5">
                                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-medium">{error}</div>}
                                {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-medium">{success}</div>}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 outline-none" placeholder="01XXXXXXXXX" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2 ml-1">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                        <button type="button" onClick={() => setView('forgot')} className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Forgot?</button>
                                    </div>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 outline-none" placeholder="••••••••" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {view === 'forgot' && (
                    <>
                        {renderHeader('Forgot Password', 'Enter your email to receive an OTP')}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                            <form onSubmit={handleRequestOTP} className="space-y-5">
                                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-medium">{error}</div>}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 outline-none" placeholder="example@email.com" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                                <button type="button" onClick={() => setView('login')} className="w-full text-slate-500 text-sm font-medium">Back to Login</button>
                            </form>
                        </div>
                    </>
                )}

                {view === 'verify' && (
                    <>
                        {renderHeader('Verify OTP', 'Enter the 6-digit code sent to your email')}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                            <form onSubmit={handleVerifyOTP} className="space-y-5">
                                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-medium">{error}</div>}
                                {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-medium">{success}</div>}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">OTP Code</label>
                                    <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-lg font-bold tracking-[1em] focus:border-indigo-500 outline-none" placeholder="000000" maxLength="6" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                <button type="button" onClick={() => setView('forgot')} className="w-full text-slate-500 text-sm font-medium">Resend OTP</button>
                            </form>
                        </div>
                    </>
                )}

                {view === 'reset' && (
                    <>
                        {renderHeader('Reset Password', 'Create a new secure password')}
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-medium">{error}</div>}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Phone Number (Confirm)</label>
                                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 outline-none" placeholder="01XXXXXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                                    <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 outline-none" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                                    <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 outline-none" placeholder="••••••••" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PosLoginPage;

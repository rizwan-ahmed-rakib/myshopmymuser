import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import BASE_URL_of_POS from '../../../posConfig';
import { useUserWithProfile } from '../profile/userWithProfile';

const PosAuthContext = createContext();

export const PosAuthProvider = ({ children }) => {
    const { setUserWith_profile } = useUserWithProfile();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = async (phone_number, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${BASE_URL_of_POS}/api/token/`, {
                phone_number,
                password
            });
            const { access, refresh, ...userData } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('user_data', JSON.stringify(userData));
            setUserWith_profile(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.detail || 'Invalid phone number or password';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user_data');
        setUserWith_profile(null);
        setIsAuthenticated(false);
    };

    const requestOTP = async (email) => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${BASE_URL_of_POS}/api/users/send-reset-otp/`, { email });
            return { success: true };
        } catch (err) {
            const msg = 'Failed to send OTP. Please check your email.';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email, otp) => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${BASE_URL_of_POS}/api/users/verify-reset-otp/`, { email, otp });
            return { success: true };
        } catch (err) {
            const msg = 'Invalid OTP. Please try again.';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (phone_number, new_password) => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${BASE_URL_of_POS}/api/users/reset-password/`, {
                phone_number,
                new_password
            });
            return { success: true };
        } catch (err) {
            const msg = 'Failed to reset password.';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return (
        <PosAuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            loading, 
            error, 
            setError,
            requestOTP,
            verifyOTP,
            resetPassword
        }}>
            {children}
        </PosAuthContext.Provider>
    );
};

export const usePosAuth = () => useContext(PosAuthContext);

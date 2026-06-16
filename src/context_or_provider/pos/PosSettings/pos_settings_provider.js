import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPosSettings, updatePosSettings } from './pos_settings_api';

const PosSettingsContext = createContext();

export const PosSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getPosSettings();
            setSettings(data);
            localStorage.setItem('pos_settings', JSON.stringify(data)); // ক্যাশ করা হলো
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (formData) => {
        try {
            const data = await updatePosSettings(formData);
            setSettings(data);
            localStorage.setItem('pos_settings', JSON.stringify(data)); // ক্যাশ আপডেট করা হলো
            return data;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <PosSettingsContext.Provider value={{ settings, loading, fetchSettings, updateSettings }}>
            {children}
        </PosSettingsContext.Provider>
    );
};

export const usePosSettings = () => useContext(PosSettingsContext);

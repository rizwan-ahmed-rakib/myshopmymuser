import React, { createContext, useState, useContext, useEffect } from 'react';
import { getQuickCash, createQuickCash, deleteQuickCash, updateQuickCash } from './quick_cash_api';

const QuickCashContext = createContext();

export const QuickCashProvider = ({ children }) => {
    const [quickCashList, setQuickCashList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuickCashList = async () => {
        try {
            setLoading(true);
            const data = await getQuickCash();
            setQuickCashList(data);
        } catch (error) {
            console.error('Error fetching quick cash:', error);
        } finally {
            setLoading(false);
        }
    };

    const addQuickCashOption = async (formData) => {
        try {
            const data = await createQuickCash(formData);
            setQuickCashList(prev => {
                // Ensure sorting after adding
                const updated = [...prev, data];
                return updated.sort((a, b) => Number(a.amount) - Number(b.amount));
            });
            return data;
        } catch (error) {
            console.error('Error adding quick cash option:', error);
            throw error;
        }
    };

    const removeQuickCashOption = async (id) => {
        try {
            await deleteQuickCash(id);
            setQuickCashList(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting quick cash option:', error);
            throw error;
        }
    };

    const updateQuickCashOption = async (id, formData) => {
        try {
            const data = await updateQuickCash(id, formData);
            setQuickCashList(prev => {
                const updated = prev.map(item => item.id === id ? data : item);
                return updated.sort((a, b) => Number(a.amount) - Number(b.amount));
            });
            return data;
        } catch (error) {
            console.error('Error updating quick cash option:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchQuickCashList();
    }, []);

    return (
        <QuickCashContext.Provider value={{ quickCashList, loading, fetchQuickCashList, addQuickCashOption, removeQuickCashOption, updateQuickCashOption }}>
            {children}
        </QuickCashContext.Provider>
    );
};

export const useQuickCash = () => useContext(QuickCashContext);

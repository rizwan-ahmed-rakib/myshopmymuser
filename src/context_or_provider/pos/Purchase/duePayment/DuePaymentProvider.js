import React, { createContext, useContext, useState } from 'react';

const DuePaymentContext = createContext();

export const DuePaymentProvider = ({ children }) => {
    const [posDuePayments, setPosDuePayments] = useState([]);

    return (
        <DuePaymentContext.Provider value={{ posDuePayments, setPosDuePayments }}>
            {children}
        </DuePaymentContext.Provider>
    );
};

export const usePosDuePayment = () => {
    const context = useContext(DuePaymentContext);
    if (!context) {
        throw new Error('usePosDuePayment must be used within a DuePaymentProvider');
    }
    return context;
};

import React, { createContext, useState, useContext } from 'react';

const PosWarrantyPeriodContext = createContext();

export const PosWarrantyPeriodProvider = ({ children }) => {
    const [posWarrantyPeriods, setPosWarrantyPeriods] = useState([]);

    return (
        <PosWarrantyPeriodContext.Provider value={{ posWarrantyPeriods, setPosWarrantyPeriods }}>
            {children}
        </PosWarrantyPeriodContext.Provider>
    );
};

export const usePosWarrantyPeriods = () => useContext(PosWarrantyPeriodContext);

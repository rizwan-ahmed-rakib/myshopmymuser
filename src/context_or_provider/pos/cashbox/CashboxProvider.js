import React, { createContext, useState, useContext } from 'react';

const PosCashboxContext = createContext();

export const PosCashboxProvider = ({ children }) => {
    const [cashboxData, setCashboxData] = useState([]);
    const [cashboxSummary, setCashboxSummary] = useState({
        income: 0,
        expense: 0,
        balance: 0,
        cash: 0,
        mobile: 0,
        bank: 0
    });

    return (
        <PosCashboxContext.Provider value={{
            cashboxData, setCashboxData,
            cashboxSummary, setSummary: setCashboxSummary
        }}>
            {children}
        </PosCashboxContext.Provider>
    );
};

export const usePosCashbox = () => useContext(PosCashboxContext);

import React, { createContext, useState, useContext } from 'react';

const PosCustomerContext = createContext();

export const PosCustomerProvider = ({ children }) => {
    const [posCustomers, setPosCustomers] = useState([]);

    return (
        <PosCustomerContext.Provider value={{  posCustomers,  setPosCustomers }}>
            {children}
        </PosCustomerContext.Provider>
    );
};

export const usePosCustomers = () => useContext(PosCustomerContext);

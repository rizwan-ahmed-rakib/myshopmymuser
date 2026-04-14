import React, { createContext, useState, useContext } from 'react';

const PosSupplierContext = createContext();

export const PosSupplierProvider = ({ children }) => {
    const [posSuppliers, setPosSuppliers] = useState([]);

    return (
        <PosSupplierContext.Provider value={{ posSuppliers, setPosSuppliers }}>
            {children}
        </PosSupplierContext.Provider>
    );
};

export const usePosSuppliers = () => useContext(PosSupplierContext);

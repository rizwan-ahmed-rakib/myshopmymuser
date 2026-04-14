import React, { createContext, useState, useContext } from 'react';

const PosProductContext = createContext();

export const PosProductProvider = ({ children }) => {
    const [posProduct, setPosProduct] = useState([]);

    return (
        <PosProductContext.Provider value={{ posProduct, setPosProduct }}>
            {children}
        </PosProductContext.Provider>
    );
};

export const usePosProducts = () => useContext(PosProductContext);
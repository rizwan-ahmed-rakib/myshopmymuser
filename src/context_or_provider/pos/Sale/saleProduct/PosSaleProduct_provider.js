import React, { createContext, useState, useContext } from 'react';

const PosSaleProductContext = createContext();

export const PosSaleProductProvider = ({ children }) => {
    const [posSaleProduct, setPosSaleProduct] = useState([]);

    return (
        <PosSaleProductContext.Provider value={{   posSaleProduct,  setPosSaleProduct }}>
            {children}
        </PosSaleProductContext.Provider>
    );
};

export const usePosSaleProducts = () => useContext(PosSaleProductContext);
import React, { createContext, useState, useContext } from 'react';

const PosPurchaseProductContext = createContext();

export const PosPurchaseProductProvider = ({ children }) => {
    const [posPurchaseProduct, setPosPurchaseProduct] = useState([]);

    return (
        <PosPurchaseProductContext.Provider value={{  posPurchaseProduct, setPosPurchaseProduct }}>
            {children}
        </PosPurchaseProductContext.Provider>
    );
};

export const usePosPurchaseProducts = () => useContext(PosPurchaseProductContext);
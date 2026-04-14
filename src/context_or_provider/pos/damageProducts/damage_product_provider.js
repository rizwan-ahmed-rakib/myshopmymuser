import React, { createContext, useState, useContext } from 'react';

const PosDamageProductContext = createContext();

export const PosDamageProductProvider = ({ children }) => {
    const [posDamageProduct, setPosDamageProduct] = useState([]);

    return (
        <PosDamageProductContext.Provider value={{  posDamageProduct, setPosDamageProduct }}>
            {children}
        </PosDamageProductContext.Provider>
    );
};

export const usePosDamageProducts = () => useContext(PosDamageProductContext);
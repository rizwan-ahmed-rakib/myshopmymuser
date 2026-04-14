import React, { createContext, useState, useContext } from 'react';

const PosBrandContext = createContext();

export const PosBrandProvider = ({ children }) => {
    const [posBrands, setPosBrands] = useState([]);

    return (
        <PosBrandContext.Provider value={{ posBrands, setPosBrands }}>
            {children}
        </PosBrandContext.Provider>
    );
};

export const usePosBrands = () => useContext(PosBrandContext);

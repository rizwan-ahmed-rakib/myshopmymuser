import React, { createContext, useState, useContext } from 'react';

const PosSizeContext = createContext();

export const PosSizeProvider = ({ children }) => {
    const [posSizes, setPosSizes] = useState([]);

    return (
        <PosSizeContext.Provider value={{posSizes, setPosSizes }}>
            {children}
        </PosSizeContext.Provider>
    );
};

export const usePosSizes = () => useContext(PosSizeContext);

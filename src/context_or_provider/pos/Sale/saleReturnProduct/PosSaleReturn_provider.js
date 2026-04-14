import React, { createContext, useState, useContext } from 'react';

const PosSaleReturnContext = createContext();

export const PosSaleReturnProvider = ({ children }) => {
    const [posSaleReturn, setPosSaleReturn] = useState([]);

    return (
        <PosSaleReturnContext.Provider value={{   posSaleReturn,   setPosSaleReturn }}>
            {children}
        </PosSaleReturnContext.Provider>
    );
};

export const usePosSaleReturn = () => useContext(PosSaleReturnContext);
import React, { createContext, useState, useContext } from 'react';

const PosPurchaseReturnContext = createContext();

export const PosPurchaseReturnProvider = ({ children }) => {
    const [posPurchaseReturn, setPosPurchaseReturn] = useState([]);

    return (
        <PosPurchaseReturnContext.Provider value={{  posPurchaseReturn,  setPosPurchaseReturn }}>
            {children}
        </PosPurchaseReturnContext.Provider>
    );
};

export const usePosPurchaseReturn = () => useContext(PosPurchaseReturnContext);
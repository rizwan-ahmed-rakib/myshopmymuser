import React, { createContext, useState, useContext } from 'react';

const PosUniqueProductInstanceContext = createContext();

export const PosUniqueProductInstanceProvider = ({ children }) => {
    const [posUniqueProductInstance, setPosUniqueProductInstance] = useState([]);

    return (
        <PosUniqueProductInstanceContext.Provider value={{posUniqueProductInstance, setPosUniqueProductInstance }}>
            {children}
        </PosUniqueProductInstanceContext.Provider>
    );
};

export const useUniqueProductInstances = () => useContext(PosUniqueProductInstanceContext);

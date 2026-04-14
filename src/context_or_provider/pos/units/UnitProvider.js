import React, { createContext, useState, useContext } from 'react';

const PosUnitContext = createContext();

export const PosUnitProvider = ({ children }) => {
    const [posUnits, setPosUnits] = useState([]);

    return (
        <PosUnitContext.Provider value={{ posUnits, setPosUnits }}>
            {children}
        </PosUnitContext.Provider>
    );
};

export const usePosUnits = () => useContext(PosUnitContext);

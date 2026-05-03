import React, { createContext, useContext, useState } from 'react';

const DueCollectionContext = createContext();

export const DueCollectionProvider = ({ children }) => {
    const [posDueCollections, setPosDueCollections] = useState([]);

    return (
        <DueCollectionContext.Provider value={{ posDueCollections, setPosDueCollections }}>
            {children}
        </DueCollectionContext.Provider>
    );
};

export const usePosDueCollection = () => {
    const context = useContext(DueCollectionContext);
    if (!context) {
        throw new Error('usePosDueCollection must be used within a DueCollectionProvider');
    }
    return context;
};

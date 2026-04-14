import React, { createContext, useState, useContext } from 'react';

const PosCategoryContext = createContext();

export const PosCategoryProvider = ({ children }) => {
    const [posCategories, setPosCategories] = useState([]);
    const [successData, setSuccessData] = useState(null);


    return (
        <PosCategoryContext.Provider value={{ posCategories, setPosCategories,successData,setSuccessData }}>
            {children}
        </PosCategoryContext.Provider>
    );
};

export const usePosCategory = () => useContext(PosCategoryContext);

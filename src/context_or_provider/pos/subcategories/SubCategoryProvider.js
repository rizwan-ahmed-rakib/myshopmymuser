import React, { createContext, useState, useContext } from 'react';

const PosSubCategoryContext = createContext();

export const PosSubCategoryProvider = ({ children }) => {
    const [posSubCategories, setPosSubCategories] = useState([]);

    return (
        <PosSubCategoryContext.Provider value={{  posSubCategories, setPosSubCategories }}>
            {children}
        </PosSubCategoryContext.Provider>
    );
};

export const useSubPosCategory = () => useContext(PosSubCategoryContext);

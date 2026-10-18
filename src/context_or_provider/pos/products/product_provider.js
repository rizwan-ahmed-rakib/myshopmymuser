// import React, { createContext, useState, useContext } from 'react';
//
// const PosProductContext = createContext();
//
// export const PosProductProvider = ({ children }) => {
//     const [posProduct, setPosProduct] = useState([]);
//
//     return (
//         <PosProductContext.Provider value={{ posProduct, setPosProduct }}>
//             {children}
//         </PosProductContext.Provider>
//     );
// };
//
// export const usePosProducts = () => useContext(PosProductContext);



import React, { createContext, useState, useContext, useCallback } from 'react';

const PosProductContext = createContext();

export const PosProductProvider = ({ children }) => {
    // ⚠️ শুধু "shared cart context" বা "active product" — full list না
    const [activeProduct, setActiveProduct] = useState(null);

    // পুরোনো API-র সাথে compat — কিন্তু সব caller কে জানান এটা deprecated
    const setPosProduct = useCallback((val) => {
        // না করলেও চলে — বা শুধু প্রথম page রাখুন
        setActiveProduct(val?.[0] || null);
    }, []);

    return (
        <PosProductContext.Provider
            value={{ activeProduct, setActiveProduct, posProduct: activeProduct ? [activeProduct] : [], setPosProduct }}
        >
            {children}
        </PosProductContext.Provider>
    );
};

export const usePosProducts = () => useContext(PosProductContext);
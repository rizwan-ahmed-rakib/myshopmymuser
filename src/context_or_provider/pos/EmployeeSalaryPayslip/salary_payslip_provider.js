// // contexts/SalaryAdvanceContext.js
// import React, { createContext, useState, useContext } from 'react';
//
// const SalaryAdvanceContext = createContext();
//
// export const SalaryAdvanceProvider = ({ children }) => {
//     const [salaryAdvances, setSalaryAdvances] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     return (
//         <SalaryAdvanceContext.Provider value={{
//             salaryAdvances,
//             setSalaryAdvances,
//             loading,
//             setLoading,
//             error,
//             setError
//         }}>
//             {children}
//         </SalaryAdvanceContext.Provider>
//     );
// };
//
// export const useSalaryAdvances = () => useContext(SalaryAdvanceContext);




// contexts/SalaryAdvanceContext.js
import React, { createContext, useState, useContext } from 'react';

const SalaryPaySlipContext = createContext();

export const SalaryPaySlipProvider = ({ children }) => {
    const [salaryPaySlip, setSalaryPaySlip] = useState([]);

    return (
        <SalaryPaySlipContext.Provider value={{  salaryPaySlip, setSalaryPaySlip }}>
            {children}
        </SalaryPaySlipContext.Provider>
    );
};

export const useSalaryPaySlip = () => useContext(SalaryPaySlipContext);
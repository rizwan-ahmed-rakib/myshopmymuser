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

const EmployeeLoanContext = createContext();

export const EmployeeLoanProvider = ({ children }) => {
    const [employeeLoan, setEmployeeLoan] = useState([]);

    return (
        <EmployeeLoanContext.Provider value={{ employeeLoan, setEmployeeLoan }}>
            {children}
        </EmployeeLoanContext.Provider>
    );
};

export const useEmployeeLoan = () => useContext(EmployeeLoanContext);
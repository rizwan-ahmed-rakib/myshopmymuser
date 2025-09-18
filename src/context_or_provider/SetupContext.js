import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import BASE_URL from "../config";

const SetupContext = createContext();

export const SetupProvider = ({children}) => {
    const [setup, setSetup] = useState(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/setup/`)
            .then(res => setSetup(res.data[0]))
            .catch(err => console.error("Setup fetch error:", err));
    }, []);

    return (
        // <SetupContext.Provider value={setup}>
        <SetupContext.Provider value={{setup, setSetup}}>

            {children}
        </SetupContext.Provider>
    );
};

export const useSetup = () => useContext(SetupContext);

import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
// import BASE_URL from "../../config";
import BASE_URL_of_POS from "../../../posConfig";
const UserWithProfileContext = createContext();

export const UserWithProfileProvider = ({children}) => {
    const [userWith_profile, setUserWith_profile] = useState(null);
    const [allProfile, setAllProfile] = useState([]); // ✅ নতুন state

    useEffect(() => {
        // 1️⃣ About us data আনবো
        axios.get(`${BASE_URL_of_POS}/api/users/create-new-user-with-profile/`)
            .then(res => setUserWith_profile(res.data))
            .catch(err => console.error("userWith_profile fetch error:", err));

        // 2️⃣ Slider banner data আনবো
        axios.get(`${BASE_URL_of_POS}/api/users/allProfile/`)
            .then(res => setAllProfile(res.data))
            .catch(err => console.error("allProfile fetch error:", err));
    }, []);

    return (
        <UserWithProfileContext.Provider value={{userWith_profile, setUserWith_profile,  allProfile, setAllProfile}}>
            {children}
        </UserWithProfileContext.Provider>
    );
};

export const useUserWithProfile = () => useContext(UserWithProfileContext);

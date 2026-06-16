import api from "../posApi";
import React, {createContext, useContext, useEffect, useState} from 'react';
const UserWithProfileContext = createContext();

export const UserWithProfileProvider = ({children}) => {
    const [userWith_profile, setUserWith_profile] = useState(() => {
        const saved = localStorage.getItem("user_data");
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [allProfile, setAllProfile] = useState([]); // ✅ নতুন state

    useEffect(() => {
        // 1️⃣ Fetch current user profile
        api.get("/api/users/create-new-user-with-profile/")
            .then(res => {
                const profiles = res.data.results || res.data;
                const savedUser = localStorage.getItem("user_data");
                if (savedUser && Array.isArray(profiles)) {
                    const parsed = JSON.parse(savedUser);
                    // Match strictly by user ID
                    const matched = profiles.find(p => {
                        const profileUserId = p.user && typeof p.user === 'object' ? p.user.id : p.user;
                        const parsedUserId = parsed.user_id || (parsed.user && typeof parsed.user === 'object' ? parsed.user.id : parsed.user);
                        
                        return profileUserId && parsedUserId && Number(profileUserId) === Number(parsedUserId);
                    });
                    
                    if (matched) {
                        setUserWith_profile(matched);
                        localStorage.setItem("user_data", JSON.stringify({ ...parsed, ...matched }));
                        return;
                    }
                }
                // Fallback setting - ONLY if no saved user is present
                if (!savedUser) {
                    if (profiles && !Array.isArray(profiles)) {
                        setUserWith_profile(profiles);
                    } else if (Array.isArray(profiles) && profiles.length > 0) {
                        setUserWith_profile(profiles[0]);
                    }
                }
            })
            .catch(err => console.error("userWith_profile fetch error:", err));

        // 2️⃣ Fetch all profiles
        api.get("/api/users/allProfile/")
            .then(res => {
                const profilesList = res.data.results || res.data;
                setAllProfile(profilesList);
            })
            .catch(err => console.error("allProfile fetch error:", err));
    }, []);

    return (
        <UserWithProfileContext.Provider value={{userWith_profile, setUserWith_profile,  allProfile, setAllProfile}}>
            {children}
        </UserWithProfileContext.Provider>
    );
};

export const useUserWithProfile = () => useContext(UserWithProfileContext);

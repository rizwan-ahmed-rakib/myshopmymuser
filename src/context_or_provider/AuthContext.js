// import {createContext, useContext, useState, useEffect} from "react";
// import axiosInstance from "../api/axiosInstance";
//
// const AuthContext = createContext();
//
// export const AuthProvider = ({children}) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(
//         !!localStorage.getItem("access")
//     );
//     const [profile, setProfile] = useState(null);
//     const [loadingProfile, setLoadingProfile] = useState(true);
//
//     // ✅ logout function
//     const logout = () => {
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         setIsAuthenticated(false);
//         setProfile(null);
//     };
//
//     // ✅ fetch profile if logged in
//     useEffect(() => {
//         const fetchProfile = async () => {
//             if (!isAuthenticated) {
//                 setProfile(null);
//                 setLoadingProfile(false);
//                 return;
//             }
//
//             try {
//                 const token = localStorage.getItem("access");
//
//                 const headers = {
//                     headers: {Authorization: `Bearer ${token}`},
//                 };
//
//                 // তোমার API এখন /api/user/profiles/ লিস্ট দিচ্ছে
//                 const res = await axiosInstance.get("/api/user/profiles/", headers);
//
//                 // ধরলাম logged in user সবসময় res.data[0]
//
//                 if (res.data && res.data.length > 0) {
//                     setProfile(res.data[0]);
//                 }
//
//                 // এখন filter করো
//                 // const myProfile = res.data.find((p) => p.id === userId);
//                 // setProfile(myProfile || null);
//             } catch (err) {
//                 console.error("Profile fetch error:", err);
//                 logout(); // token expire হলে logout করে দিবে
//             } finally {
//                 setLoadingProfile(false);
//             }
//         };
//
//         fetchProfile();
//     }, [isAuthenticated]);
//
//     return (
//         <AuthContext.Provider
//             value={{
//                 isAuthenticated,
//                 setIsAuthenticated,
//                 logout,
//                 profile,
//                 setProfile,
//                 loadingProfile,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => useContext(AuthContext);




import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ logout function
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setProfile(null);

    // axiosInstance এর default header থেকেও Authorization remove করো
    delete axiosInstance.defaults.headers.Authorization;
  };

  // ✅ fetch profile if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/api/user/profiles/");

        if (Array.isArray(res.data) && res.data.length > 0) {
          setProfile(res.data[0]); // ধরলাম প্রথম profile-টাই user
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        logout(); // token expire বা অন্য error হলে logout
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        logout,
        profile,
        setProfile,
        loadingProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

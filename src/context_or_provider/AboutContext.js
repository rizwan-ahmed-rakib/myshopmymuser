// import React, {createContext, useContext, useEffect, useState} from 'react';
// import axios from 'axios';
// import BASE_URL from "../config";
//
// const AboutContext = createContext();
//
// export const AboutProvider = ({children}) => {
//     const [about, setAbout] = useState(null);
//
//     useEffect(() => {
//         axios.get(`${BASE_URL}/api/aboutus/setup_page/`)
//             .then(res => setAbout(res.data[0]))
//             .catch(err => console.error("About fetch error:", err));
//     }, []);
//
//     return (
//         // <AboutContext.Provider value={about}>
//         <AboutContext.Provider value={{about, setAbout}}>
//
//             {children}
//         </AboutContext.Provider>
//     );
// };
//
// export const useAbout = () => useContext(AboutContext);




import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import BASE_URL from "../config";

const AboutContext = createContext();

export const AboutProvider = ({children}) => {
    const [about, setAbout] = useState(null);
    const [sliderBanners, setSliderBanners] = useState([]); // ✅ নতুন state

    useEffect(() => {
        // 1️⃣ About us data আনবো
        axios.get(`${BASE_URL}/api/aboutus/setup_page/`)
            .then(res => setAbout(res.data[0]))
            .catch(err => console.error("About fetch error:", err));

        // 2️⃣ Slider banner data আনবো
        axios.get(`${BASE_URL}/api/aboutus/slider-banner/`)
            .then(res => setSliderBanners(res.data))
            .catch(err => console.error("Slider banner fetch error:", err));
    }, []);

    return (
        <AboutContext.Provider value={{about, setAbout, sliderBanners, setSliderBanners}}>
            {children}
        </AboutContext.Provider>
    );
};

export const useAbout = () => useContext(AboutContext);

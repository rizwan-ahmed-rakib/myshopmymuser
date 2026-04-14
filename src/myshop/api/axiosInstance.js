// // src/api/axiosInstance.js
// import axios from "axios";
// import BASE_URL from "../config";
//
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
//
// // 🔄 Interceptor for expired access token
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//
//     // যদি token expire হয়ে যায় (401) এবং আগে retry না করা হয়
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//
//       try {
//         const refresh = localStorage.getItem("refresh");
//         if (refresh) {
//           const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
//             refresh,
//           });
//
//           // নতুন access token সেভ করো
//           localStorage.setItem("access", res.data.access);
//
//           // future request এর জন্য নতুন access token সেট করো
//           axiosInstance.defaults.headers[
//             "Authorization"
//           ] = `Bearer ${res.data.access}`;
//           originalRequest.headers[
//             "Authorization"
//           ] = `Bearer ${res.data.access}`;
//
//           // পুরোনো request আবার চালাও
//           return axiosInstance(originalRequest);
//         }
//       } catch (err) {
//         console.error("Refresh token expired! Logging out...");
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = "/login"; // logout করে login এ পাঠানো হবে
//       }
//     }
//     return Promise.reject(error);
//   }
// );
//
// export default axiosInstance;



import axios from "axios";
import BASE_URL from "../../config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor – প্রতিটি request এ fresh access token বসানো হবে
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor – access token expire হলে refresh করবে
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
            refresh,
          });

          localStorage.setItem("access", res.data.access);

          // 🔥 নতুন access token future request এর জন্য বসাও
          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${res.data.access}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.data.access}`;

          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token expired! Logging out...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

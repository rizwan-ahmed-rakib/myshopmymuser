import axios from "axios";
import BASE_URL_of_POS from "../../posConfig";

// Create axios instance with base URL
const api = axios.create({
    baseURL: BASE_URL_of_POS,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor to append authorization token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Variables to handle token refresh queueing to prevent multiple duplicate refreshes
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor to refresh token on 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 Unauthorized and the request has not been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If a token refresh is already in progress, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Send refresh token request using direct axios to avoid interceptor loop
                const response = await axios.post(`${BASE_URL_of_POS}/api/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access, refresh } = response.data;

                // Save new access token
                localStorage.setItem("token", access);
                // Simple-JWT with ROTATE_REFRESH_TOKENS: True returns a new refresh token
                if (refresh) {
                    localStorage.setItem("refresh", refresh);
                }

                // Update auth header for the current failed request
                originalRequest.headers["Authorization"] = `Bearer ${access}`;
                
                // Process any other queued requests with the new token
                processQueue(null, access);

                isRefreshing = false;
                
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;

                console.error("Token refresh failed:", refreshError);

                // Clear authentication data
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user_data");

                // Redirect to login if we are not already on the login page
                if (window.location.pathname !== "/poslogin") {
                    window.location.href = "/poslogin";
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

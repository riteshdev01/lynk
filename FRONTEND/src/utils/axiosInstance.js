import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    timeout:10000, //10s
    withCredentials:true
})

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code within the range of 2xx
        return response;
    },
    (error) => {
        return Promise.reject({
            message:
                error.response?.data?.message ||
                (error.request ? "Network Error" : error.message) ||
                "Unknown error occurred",
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);
export default axiosInstance
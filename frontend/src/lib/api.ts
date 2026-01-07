import axios from "axios";
console.log(import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // only if using cookies/session auth
    timeout: 10000,
});

export default api;


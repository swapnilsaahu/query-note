import axios from "axios";

const api = axios.create({
    baseURL: "",
    withCredentials: true, // only if using cookies/session auth
    timeout: 10000,
});

export default api;


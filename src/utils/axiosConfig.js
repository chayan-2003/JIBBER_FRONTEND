import axios from 'axios';

const baseURL=process.env.NODE_ENV === 'production' ? 'https://jibber-backend.onrender.com' : 'http://localhost:5000';
const axiosInstance = axios.create({
    baseURL: baseURL, 
    withCredentials: true, 
});

export default axiosInstance;
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000' || 'https://jibber-backend.onrender.com', 
    withCredentials: true, 
});

export default axiosInstance;
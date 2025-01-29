import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const APIURL = process.env.NODE_ENV === 'production' ? 'https://jibber-backend.onrender.com' : 'http://localhost:5000';
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response= await axios.post(`${APIURL}/api/users/login`, {
            email,
            password}, { withCredentials: true });
            console.log(response);
            
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        
            //i will just do this for handshaking as fetching an user from its token is tedious:)
            navigate('/chat');
    } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="logged">Login</button>
            </form>
        </div>
    );
};

export default Login;
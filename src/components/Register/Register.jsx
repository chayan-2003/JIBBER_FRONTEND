import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const APIURL = process.env.NODE_ENV === 'production' ? 'https://jibber-backend.onrender.com/' : 'http://localhost:5000';
    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch(`${APIURL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        console.log(data);
        // Handle successful registration (e.g., navigate to login)
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <button type="submit" className="submit-button">Register</button>
            </form>
            <p className="redirect-text">
                Already a user? <span onClick={() => navigate('/login')} className="redirect-link">Login here</span>
            </p>
        </div>
    );
};

export default Register;
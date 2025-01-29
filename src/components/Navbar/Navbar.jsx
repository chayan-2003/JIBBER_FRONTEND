import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate('/')}>
                Jibber
            </div>
            <div className="navbar-links">
                <button 
                    className="navbar-link" 
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                <button 
                    className="navbar-link about" 
                    onClick={() => navigate('/about')}
                >
                    About Us
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
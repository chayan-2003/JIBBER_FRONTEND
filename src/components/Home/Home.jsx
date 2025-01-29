import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
         <Navbar />
    <div className="landing-page">
 
     <section className="hero">
                <h1>Welcome to Jibber</h1>
                <p>Connect effortlessly with friends and family through our intuitive and secure platform.</p>
                <div className="button-group">
                    <button 
                        className="cta-button" 
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                    <button 
                        className="login-button" 
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </section>
      <section className="features">
        <h2>Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Real-Time Messaging</h3>
            <p>Experience instant messaging with real-time updates.</p>
          </div>
          <div className="feature-item">
            <h3>Secure Communication</h3>
            <p>All your conversations are protected with end-to-end encryption.</p>
          </div>
          <div className="feature-item">
            <h3>Group Chats</h3>
            <p>Create and manage groups effortlessly.</p>
          </div>
          <div className="feature-item">
            <h3>Notification</h3>
            <p>Get Notified when Others are typing</p>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};

export default Home;
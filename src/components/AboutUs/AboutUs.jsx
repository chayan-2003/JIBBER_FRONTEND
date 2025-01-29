import React from 'react';
import './AboutUs.css';
import Navbar from '../Navbar/Navbar';
import { FaReact, FaDatabase, FaNodeJs } from 'react-icons/fa';
import { SiSocketdotio } from 'react-icons/si'; // Updated import
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="navbarabout">
      <Navbar />
      </div>
      <div className="aboutus-container">
        <h1>About Us</h1>
        
        <section className="section mission">
          <h2>Our Mission</h2>
          <p>
            At Jibber, our mission is to connect people seamlessly across the globe through real-time communication. We believe in breaking down barriers and fostering meaningful interactions in an ever-connected world.
          </p>
        </section>
        
        <section className="section technologies">
          <h2>Powered by WebSockets & Socket.IO</h2>
          <p>
            Traditional HTTP requests are limited in their ability to handle real-time communication efficiently. That's where <strong>WebSockets</strong> come into play. WebSockets establish a persistent connection between the client and server, allowing for two-way communication without the overhead of constant HTTP requests. This technology ensures that messages are delivered instantly, providing a smooth and responsive chat experience.
          </p>
          <p>
            We leverage <strong>Socket.IO</strong> to harness the full potential of WebSockets. Socket.IO not only simplifies the implementation of real-time communication but also adds robustness by handling fallback options for clients that do not support WebSockets. This ensures that every user, regardless of their browser or network conditions, enjoys a reliable and consistent chat experience.
          </p>
        </section>
        
        <section className="section features">
          <h2>What Makes Jibber Unique</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaReact className="feature-icon" />
              <h3>React.js</h3>
              <p>Building a dynamic and responsive user interface.</p>
            </div>
            <div className="feature-card">
              <FaDatabase className="feature-icon" />
              <h3>MongoDB</h3>
              <p>Managing data with a flexible, scalable NoSQL database.</p>
            </div>
            <div className="feature-card">
              <FaNodeJs className="feature-icon" />
              <h3>Express.js</h3>
              <p>Creating a robust backend with a minimalistic framework.</p>
            </div>
            <div className="feature-card">
              <SiSocketdotio className="feature-icon" /> {/* Updated icon */}
              <h3>Socket.IO</h3>
              <p>Facilitating real-time, bidirectional communication.</p>
            </div>
          </div>
        </section>
        
        <section className="section team">
          <h2>Developed by</h2>
          <div className="team-grid">
            <div className="team-member">
            <a href="https://www.linkedin.com/in/chayan-ghosh-930a2a249/"><img src="https://i.ibb.co/sKR7qqz/Screenshot-2025-01-28-133454.png" alt="Screenshot-2025-01-28-133454" border="0" /></a>
              <h3>Chayan Ghosh</h3>
            
            </div>
          </div>
        </section>
        

        
        <section className="section join-us">
          <h2>Join Us</h2>
          <p>
            Whether you're looking to connect with friends, collaborate with colleagues, or join communities that share your passions, Jibber is your go-to platform for all your real-time communication needs. Join us today and be a part of a vibrant and dynamic chat community!
          </p>
          <button className="join-button" onClick={() => navigate('/register')}>Get Started</button>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', formData);
            
            // 1. Save the user data to Local Storage
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // 2. Dispatch a storage event to notify other tabs/windows
            window.dispatchEvent(new Event("storage"));

            alert("Login successful!");
            navigate('/');
        } catch (err) {
            alert("Login Failed: " + (err.response?.data || "Unknown Error"));
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Sign In</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="auth-input"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="auth-input"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit" className="auth-button">Sign In</button>
                <p className="auth-link">
                    New to KaanFlix? <span onClick={() => navigate('/register')}>Sign up now.</span>
                </p>
            </form>
        </div>
    );
};

export default Login;
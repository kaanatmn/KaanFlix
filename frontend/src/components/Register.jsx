import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }
        
        try {
            const response = await api.post('/api/auth/register', formData);
            alert(response.data);
            navigate('/login');
        } catch (err) {
            const errorMsg = typeof err.response?.data === 'string' 
                ? err.response.data 
                : JSON.stringify(err.response?.data) || "Unknown Error";
            alert("Registration Failed: " + errorMsg);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Sign Up</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="auth-input"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="auth-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password (min 6 characters)" 
                    className="auth-input"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit" className="auth-button">Sign Up</button>
                <p className="auth-link">
                    Already have an account? <span onClick={() => navigate('/login')}>Sign in.</span>
                </p>
            </form>
        </div>
    );
};

export default Register;
import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/register', formData);
            alert(response.data); // Show success message
            navigate('/login'); // Redirect to Login
        } catch (err) {
            alert("Registration Failed: " + (err.response?.data || "Unknown Error"));
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
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="auth-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="auth-input"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
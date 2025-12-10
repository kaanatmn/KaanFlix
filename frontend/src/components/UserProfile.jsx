import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Reuse the form styles

const UserProfile = () => {
    const navigate = useNavigate();
    // Get user from memory
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        // Clear memory
        localStorage.removeItem('user');
        // Notify App to update header
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    if (!user) {
        return <div className="auth-container"><h2 style={{color:'white'}}>Please Log In</h2></div>;
    }

    return (
        <div className="auth-container">
            <div className="auth-form" style={{textAlign: 'center'}}>
                {/* Default Silhouette Icon */}
                <div style={{
                    width: '100px', 
                    height: '100px', 
                    backgroundColor: '#e50914', 
                    borderRadius: '50%', 
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>

                <h2 className="auth-title">Hi, {user.username}</h2>
                <p style={{color: '#ccc', marginBottom: '20px'}}>Email: {user.email}</p>

                {/* later */}
                <button className="auth-button" style={{backgroundColor: '#333'}}>Edit Profile</button>
                <button className="auth-button" style={{backgroundColor: '#333'}}>Change Password</button>
                
                <hr style={{borderColor: '#333', width: '100%', margin: '20px 0'}}/>

                <button onClick={handleLogout} className="auth-button" style={{backgroundColor: '#e50914'}}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
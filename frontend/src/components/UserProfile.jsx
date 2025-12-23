import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Auth.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    
    // Edit mode states
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    // Form data
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
    const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!user) {
        return <div className="auth-container"><h2 style={{color:'white'}}>Please Log In</h2></div>;
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    // Helper (for error messages)
    const getErrorMessage = (error) => {
        if (error.response) {
            // Server responded with error:
            if (typeof error.response.data === 'string') {
                return error.response.data;
            } else if (error.response.data.message) {
                return error.response.data.message;
            } else if (error.response.statusText) {
                return error.response.statusText;
            }
        } else if (error.message) {
            return error.message;
        }
        return "An unknown error occurred";
    };

    // Update username
    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            alert("Username cannot be empty!");
            return;
        }

        try {
            const response = await api.put('/api/user/update-username', {
                userId: user.id,
                newUsername: newUsername.trim()
            });
            
            // Update localStorage and state
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            window.dispatchEvent(new Event("storage"));
            
            alert("Username updated successfully!");
            setEditingUsername(false);
            setNewUsername('');
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            alert("Failed to update username: " + errorMsg);
            console.error("Update username error:", err);
        }
    };

    // Update email
    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (!newEmail.trim() || !currentPasswordForEmail.trim()) {
            alert("Please fill all fields!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            alert("Please enter a valid email address!");
            return;
        }

        try {
            const response = await api.put('/api/user/update-email', {
                userId: user.id,
                currentPassword: currentPasswordForEmail,
                newEmail: newEmail.trim()
            });
            
            // Update localStorage and state
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            
            alert("Email updated successfully!");
            setEditingEmail(false);
            setNewEmail('');
            setCurrentPasswordForEmail('');
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            alert("Failed to update email: " + errorMsg);
            console.error("Update email error:", err);
        }
    };

    // Update password
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (!currentPasswordForPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            alert("Please fill all fields!");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }

        try {
            await api.put('/api/user/update-password', {
                userId: user.id,
                currentPassword: currentPasswordForPassword,
                newPassword: newPassword
            });
            
            alert("Password updated successfully!");
            setEditingPassword(false);
            setCurrentPasswordForPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const errorMsg = getErrorMessage(err);
            alert("Failed to update password: " + errorMsg);
            console.error("Update password error:", err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form" style={{textAlign: 'center', maxWidth: '500px'}}>
                {/* Profile Icon - Auto-updates with username */}
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

                <hr style={{borderColor: '#333', width: '100%', margin: '20px 0'}}/>

                {/* Change Username Section */}
                <div style={{marginBottom: '20px', textAlign: 'left'}}>
                    {!editingUsername ? (
                        <button 
                            className="auth-button" 
                            style={{backgroundColor: '#333', width: '100%'}}
                            onClick={() => setEditingUsername(true)}
                        >
                            Change Username
                        </button>
                    ) : (
                        <form onSubmit={handleUpdateUsername}>
                            <input 
                                type="text" 
                                className="auth-input"
                                placeholder="New Username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                style={{marginBottom: '10px'}}
                                autoFocus
                            />
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" className="auth-button" style={{backgroundColor: '#e50914', flex: 1}}>
                                    Save
                                </button>
                                <button 
                                    type="button" 
                                    className="auth-button" 
                                    style={{backgroundColor: '#555', flex: 1}}
                                    onClick={() => {
                                        setEditingUsername(false); 
                                        setNewUsername('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Change Email Section */}
                <div style={{marginBottom: '20px', textAlign: 'left'}}>
                    {!editingEmail ? (
                        <button 
                            className="auth-button" 
                            style={{backgroundColor: '#333', width: '100%'}}
                            onClick={() => setEditingEmail(true)}
                        >
                            Change Email
                        </button>
                    ) : (
                        <form onSubmit={handleUpdateEmail}>
                            <input 
                                type="email" 
                                className="auth-input"
                                placeholder="New Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                style={{marginBottom: '10px'}}
                                autoFocus
                            />
                            <input 
                                type="password" 
                                className="auth-input"
                                placeholder="Current Password (for security)"
                                value={currentPasswordForEmail}
                                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                                style={{marginBottom: '10px'}}
                            />
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" className="auth-button" style={{backgroundColor: '#e50914', flex: 1}}>
                                    Save
                                </button>
                                <button 
                                    type="button" 
                                    className="auth-button" 
                                    style={{backgroundColor: '#555', flex: 1}}
                                    onClick={() => {
                                        setEditingEmail(false); 
                                        setNewEmail(''); 
                                        setCurrentPasswordForEmail('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Change Password Section */}
                <div style={{marginBottom: '20px', textAlign: 'left'}}>
                    {!editingPassword ? (
                        <button 
                            className="auth-button" 
                            style={{backgroundColor: '#333', width: '100%'}}
                            onClick={() => setEditingPassword(true)}
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handleUpdatePassword}>
                            <input 
                                type="password" 
                                className="auth-input"
                                placeholder="Current Password"
                                value={currentPasswordForPassword}
                                onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
                                style={{marginBottom: '10px'}}
                                autoFocus
                            />
                            <input 
                                type="password" 
                                className="auth-input"
                                placeholder="New Password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{marginBottom: '10px'}}
                            />
                            <input 
                                type="password" 
                                className="auth-input"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{marginBottom: '10px'}}
                            />
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" className="auth-button" style={{backgroundColor: '#e50914', flex: 1}}>
                                    Save
                                </button>
                                <button 
                                    type="button" 
                                    className="auth-button" 
                                    style={{backgroundColor: '#555', flex: 1}}
                                    onClick={() => {
                                        setEditingPassword(false); 
                                        setCurrentPasswordForPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <hr style={{borderColor: '#333', width: '100%', margin: '20px 0'}}/>

                <button onClick={handleLogout} className="auth-button" style={{backgroundColor: '#e50914', width: '100%'}}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
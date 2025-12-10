import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from './api/axiosConfig';
import MovieCard from './components/MovieCard';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile'; // Import new page
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null); // Track logged in user
  const navigate = useNavigate();

  // 1. Check if user is logged in on startup
  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for login/logout events to update header instantly
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // 2. Fetch Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const endpoint = searchQuery 
          ? `/api/movies/search?query=${searchQuery}` 
          : '/api/movies/popular';
        const response = await api.get(endpoint);
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        setMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate('/');
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand" onClick={() => {setSearchQuery(''); navigate('/');}}>KaanFlix</h1>
        <SearchBar onSearch={handleSearch} />
        
        {/* LOGIC: If User -> Show Icon. If No User -> Show Sign In */}
        {user ? (
            <div 
                onClick={() => navigate('/profile')}
                style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer'
                }}
            >
                <span style={{color: 'white', fontWeight: 'bold'}}>{user.username}</span>
                {/* The Silhouette Icon */}
                <div style={{
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#e50914', 
                    borderRadius: '5px',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
            </div>
        ) : (
            <button className="auth-button" style={{width: 'auto', padding: '10px 20px'}} onClick={() => navigate('/login')}>
                Sign In
            </button>
        )}
      </header>
      
      <Routes>
        <Route path="/" element={
            <div className="movie-container">
                {movies?.length > 0 ? (
                    movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    <h2 style={{color: 'white'}}>No movies found</h2>
                )}
            </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;
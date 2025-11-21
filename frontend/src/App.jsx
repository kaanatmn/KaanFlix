import { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import MovieCard from './components/MovieCard';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // We track the search term here

  // This Effect runs AUTOMATICALLY whenever 'searchQuery' changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Decide which URL to use based on if we have a search query
        const endpoint = searchQuery 
          ? `/api/movies/search?query=${searchQuery}` 
          : '/api/movies/popular';

        const response = await api.get(endpoint);
        
        const data = typeof response.data === 'string' 
          ? JSON.parse(response.data) 
          : response.data;

        setMovies(data.results);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, [searchQuery]); // <--- This [searchQuery] is the magic. It watches for changes.

  // When the user types and hits enter, we just update the query state
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand" onClick={() => setSearchQuery('')} style={{cursor: 'pointer'}}>KaanFlix</h1>
        <SearchBar onSearch={handleSearch} />
      </header>
      
      <div className="movie-container">
        {movies?.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
            <h2 style={{color: 'white'}}>No movies found</h2>
        )}
      </div>
    </div>
  );
}

export default App;
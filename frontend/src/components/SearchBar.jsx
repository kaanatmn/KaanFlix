import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input 
                type="text" 
                className="search-input"
                placeholder="Search for a movie..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
};

export default SearchBar;
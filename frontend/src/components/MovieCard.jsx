import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <div className="movie-poster">
                {/* Use the TMDB image URL structure */}
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                />
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                    {/* Show rating with one decimal place */}
                    <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                    {/* Show only the year */}
                    <span className="date">{movie.release_date?.split('-')[0]}</span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
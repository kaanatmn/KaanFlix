import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddToList, setShowAddToList] = useState(false);
    const [userLists, setUserLists] = useState([]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await api.get(`/api/movies/${id}`);
                const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                console.log("Movie data:", data);
                setMovie(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching movie details:", err);
                alert("Failed to load movie details. Please try again.");
                setLoading(false);
            }
        };

        const fetchUserLists = async () => {
            if (user) {
                try {
                    const response = await api.get(`/api/lists/user/${user.id}`);
                    setUserLists(response.data);
                } catch (err) {
                    console.error("Error fetching user lists:", err);
                }
            }
        };

        fetchMovieDetails();
        fetchUserLists();
    }, [id, user]);

    const handleAddToList = async (listId) => {
        if (!movie || !movie.id) {
            alert("Movie data not loaded yet!");
            return;
        }

        try {
            console.log("Adding movie to list:", {
                listId,
                tmdbMovieId: movie.id,
                movieTitle: movie.title,
                posterPath: movie.poster_path
            });

            await api.post('/api/lists/add-movie', {
                listId: listId,
                tmdbMovieId: parseInt(movie.id),
                movieTitle: movie.title,
                posterPath: movie.poster_path || ''
            });
            
            alert("Movie added to list!");
            setShowAddToList(false);
        } catch (err) {
            console.error("Add to list error:", err);
            const errorMsg = typeof err.response?.data === 'string' 
                ? err.response.data 
                : JSON.stringify(err.response?.data) || "Failed to add movie";
            alert("Error: " + errorMsg);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!movie) {
        return <div className="loading">Movie not found</div>;
    }

    const cast = movie.credits?.cast?.slice(0, 10) || [];
    const director = movie.credits?.crew?.find(person => person.job === 'Director');
    const trailer = movie.videos?.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
    );

    return (
        <div className="movie-detail">
            <div 
                className="backdrop" 
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                }}
            />

            <div className="detail-content">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="detail-grid">
                    <div className="poster-section">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title}
                            className="detail-poster"
                        />
                        {user && (
                            <button 
                                className="add-to-list-btn"
                                onClick={() => setShowAddToList(true)}
                            >
                                + Add to List
                            </button>
                        )}
                    </div>

                    <div className="info-section">
                        <h1 className="movie-title">{movie.title}</h1>
                        
                        <div className="movie-meta-info">
                            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}/10</span>
                            <span className="divider">•</span>
                            <span>{movie.release_date?.split('-')[0]}</span>
                            <span className="divider">•</span>
                            <span>{movie.runtime} min</span>
                        </div>

                        <div className="genres">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="genre-tag">{genre.name}</span>
                            ))}
                        </div>

                        {movie.tagline && (
                            <p className="tagline">"{movie.tagline}"</p>
                        )}

                        <div className="section">
                            <h3>Overview</h3>
                            <p className="overview">{movie.overview}</p>
                        </div>

                        {director && (
                            <div className="section">
                                <h3>Director</h3>
                                <p>{director.name}</p>
                            </div>
                        )}

                        {cast.length > 0 && (
                            <div className="section">
                                <h3>Cast</h3>
                                <div className="cast-grid">
                                    {cast.map(actor => (
                                        <div key={actor.id} className="cast-member">
                                            {actor.profile_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                                                    alt={actor.name}
                                                    className="cast-photo"
                                                />
                                            ) : (
                                                <div className="cast-photo-placeholder">
                                                    {actor.name.charAt(0)}
                                                </div>
                                            )}
                                            <p className="cast-name">{actor.name}</p>
                                            <p className="cast-character">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {trailer && (
                            <div className="section">
                                <h3>Trailer</h3>
                                <div className="trailer-container">
                                    <iframe
                                        width="100%"
                                        height="400"
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title="Movie Trailer"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAddToList && (
                <div className="modal-overlay" onClick={() => setShowAddToList(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add to List</h2>
                        {userLists.length === 0 ? (
                            <div>
                                <p style={{color: '#aaa'}}>You don't have any lists yet.</p>
                                <button 
                                    className="modal-btn create"
                                    onClick={() => navigate('/my-lists')}
                                >
                                    Create a List
                                </button>
                            </div>
                        ) : (
                            <div className="lists-selection">
                                {userLists.map(list => (
                                    <div 
                                        key={list.id} 
                                        className="list-option"
                                        onClick={() => handleAddToList(list.id)}
                                    >
                                        <div>
                                            <h4>{list.name}</h4>
                                            <p>{list.movieCount} movies</p>
                                        </div>
                                        <span>+</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button 
                            className="modal-btn cancel"
                            onClick={() => setShowAddToList(false)}
                            style={{marginTop: '15px', width: '100%'}}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;
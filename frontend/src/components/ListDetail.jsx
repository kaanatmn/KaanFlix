import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Lists.css';

const ListDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListDetails = async () => {
            try {
                const response = await api.get(`/api/lists/${id}`);
                setList(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching list details:", err);
                setLoading(false);
            }
        };

        fetchListDetails();
    }, [id]);

    const fetchListDetailsRefresh = async () => {
        try {
            const response = await api.get(`/api/lists/${id}`);
            setList(response.data);
        } catch (err) {
            console.error("Error fetching list details:", err);
        }
    };

    const handleRemoveMovie = async (itemId) => {
        if (!window.confirm("Remove this movie from the list?")) return;

        try {
            await api.delete(`/api/lists/remove-movie/${itemId}?userId=${user.id}`);
            fetchListDetailsRefresh();
        } catch (err) {
            alert("Error: " + (err.response?.data || "Failed to remove movie"));
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!list) {
        return <div className="loading">List not found</div>;
    }

    const isOwner = user && list.userId === user.id;

    return (
        <div className="list-detail-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="list-detail-header">
                <div>
                    <h1>{list.name}</h1>
                    {list.isPublic && <span className="public-badge">Public</span>}
                    <p className="list-owner">by {list.username}</p>
                    {list.description && <p className="list-description">{list.description}</p>}
                </div>
                <div className="list-stats">
                    <span>🎬 {list.movies?.length || 0} movies</span>
                </div>
            </div>

            <div className="movie-grid">
                {list.movies && list.movies.length === 0 ? (
                    <p className="no-movies">This list is empty. Add some movies!</p>
                ) : (
                    list.movies?.map(item => (
                        <div key={item.id} className="movie-item">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                alt={item.movieTitle}
                                className="movie-item-poster"
                                onClick={() => navigate(`/movie/${item.tmdbMovieId}`)}
                            />
                            <h4>{item.movieTitle}</h4>
                            {isOwner && (
                                <button
                                    className="remove-movie-btn"
                                    onClick={() => handleRemoveMovie(item.id)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListDetail;
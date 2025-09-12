import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MovieFinderPage({ token, onLogout }) {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const authAxios = axios.create({
        headers: { Authorization: `Bearer ${token}` }
    });

    const searchMovies = async () => {
        if (!query) return;
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`/api/movies/search?title=${query}`);
            if (res.data.Response === "False") {
                setMovies([]);
                setError("No results found.");
            } else {
                setMovies(res.data.Search || []);
            }
        } catch (err) {
            setError("Error fetching movies.");
        }
        setLoading(false);
    };

    const fetchFavorites = async () => {
        try {
            const res = await authAxios.get("/api/movies/favorites");
            setFavorites(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addFavorite = async (movie) => {
        try {
            await authAxios.post("/api/movies/favorite", {
                imdbID: movie.imdbID,
                title: movie.Title,
                year: movie.Year,
                poster: movie.Poster
            });
            fetchFavorites();
        } catch (err) {
            alert("Error adding favorite");
        }
    };

    const removeFavorite = async (imdbID) => {
        try {
            await authAxios.delete(`/api/movies/favorite/${imdbID}`);
            fetchFavorites();
        } catch (err) {
            alert("Error removing favorite");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>🎬 Movie Finder</h1>
            <button onClick={onLogout}>Logout</button>

            <div>
                <input placeholder="Enter movie title..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button onClick={searchMovies}>Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Search Results</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {movies.map((m) => (
                    <div key={m.imdbID} style={{ border: "1px solid #ccc", padding: "10px", width: "180px" }}>
                        <img src={m.Poster} alt={m.Title} style={{ width: "100%" }} />
                        <h4>{m.Title}</h4>
                        <p>{m.Year}</p>
                        <button onClick={() => addFavorite(m)}>⭐ Add Favorite</button>
                    </div>
                ))}
            </div>

            <h2>Your Favorites</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {favorites.map((f) => (
                    <div key={f.imdbID} style={{ border: "1px solid #ccc", padding: "10px", width: "180px" }}>
                        <img src={f.poster} alt={f.title} style={{ width: "100%" }} />
                        <h4>{f.title}</h4>
                        <p>{f.year}</p>
                        <button onClick={() => removeFavorite(f.imdbID)}>❌ Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

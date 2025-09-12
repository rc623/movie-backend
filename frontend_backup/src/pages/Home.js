import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Favorites from "../components/Favorites";

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        const res = await fetch("/api/movies/favorites");
        const data = await res.json();
        setFavorites(data);
    };

    const handleSearch = async (title) => {
        const res = await fetch(`/api/movies/search?title=${title}`);
        const data = await res.json();
        setMovies(data.Search || []);
    };

    const handleFavorite = async (movie) => {
        await fetch("/api/movies/favorite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movie),
        });
        fetchFavorites();
    };

    return (
        <div className="p-4">
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-3 gap-4 mt-6">
                {movies.map((m) => (
                    <MovieCard key={m.imdbID} movie={m} onFavorite={handleFavorite} />
                ))}
            </div>
            <Favorites favorites={favorites} />
        </div>
    );
}

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]); // always an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const token = localStorage.getItem("token");

  // ✅ Stable axios instance with token
  const authAxios = useMemo(() => {
    if (!token) return null;
    return axios.create({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token]);

  // SEARCH MOVIES
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
      console.error(err);
      setError("Error fetching movies.");
    }
    setLoading(false);
  };

  // FAVORITES
  const fetchFavorites = useCallback(async () => {
    if (!token || !authAxios) return;
    try {
      const res = await authAxios.get("/api/movies/favorites");
      const data = res.data;

      if (Array.isArray(data)) setFavorites(data);
      else if (Array.isArray(data.favorites)) setFavorites(data.favorites);
      else setFavorites([]);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setFavorites([]);
    }
  }, [token, authAxios]);

  const addFavorite = async (movie) => {
    if (!token || !authAxios) return alert("Please login first!");
    try {
      await authAxios.post("/api/movies/favorite", {
        imdbID: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
      });
      fetchFavorites();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error adding favorite.");
    }
  };

  const removeFavorite = async (imdbID) => {
    if (!token || !authAxios) return alert("Please login first!");
    try {
      await authAxios.delete(`/api/movies/favorite/${imdbID}`);
      fetchFavorites();
    } catch (err) {
      console.error("Frontend delete error:", err.response?.data || err.message);
      alert("Error removing favorite.");
    }
  };

  // AUTH
  const handleRegister = async () => {
    try {
      const res = await axios.post("/api/auth/register", { username, email, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      fetchFavorites();
      alert("Registration successful!");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      fetchFavorites();
      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setFavorites([]);
    alert("Logged out!");
  };

  // useEffect to fetch favorites when token changes
  useEffect(() => {
    if (token) fetchFavorites();
  }, [token, fetchFavorites]);

  return (
    <>
      <Helmet>
        <title>{query ? `Searching: ${query}` : "Movie Finder App"}</title>
      </Helmet>

      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>🎬 Movie Finder</h1>

        {/* Authentication */}
        {!isLoggedIn ? (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "300px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Register / Login</h3>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleRegister} style={{ padding: "8px", width: "48%" }}>
                Register
              </button>
              <button onClick={handleLogin} style={{ padding: "8px", width: "48%" }}>
                Login
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleLogout} style={{ marginBottom: "20px", padding: "8px" }}>
            Logout
          </button>
        )}

        {/* Search Box */}
        <div>
          <input
            type="text"
            placeholder="Enter movie title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: "8px", width: "250px" }}
          />
          <button onClick={searchMovies} style={{ padding: "8px", marginLeft: "8px" }}>
            Search
          </button>
        </div>

        {/* Status */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Search Results */}
        <h2>Search Results</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {movies.map((m) => (
            <div
              key={m.imdbID}
              style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px", width: "180px" }}
            >
              <img src={m.Poster} alt={m.Title} style={{ width: "100%" }} />
              <h4>{m.Title}</h4>
              <p>{m.Year}</p>
              <button onClick={() => addFavorite(m)}>⭐ Add Favorite</button>
            </div>
          ))}
        </div>

        {/* Favorites */}
        <h2>Your Favorites</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {favorites.length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            favorites.map((f) => (
              <div
                key={f.imdbID}
                style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px", width: "180px" }}
              >
                <img src={f.poster} alt={f.title} style={{ width: "100%" }} />
                <h4>{f.title}</h4>
                <p>{f.year}</p>
                <button onClick={() => removeFavorite(f.imdbID)}>❌ Remove</button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;

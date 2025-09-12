import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const res = await axios.post("/api/auth/register", { username, email, password });
            onLogin(res.data.token);
            alert("Registration successful!");
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            onLogin(res.data.token);
            alert("Login successful!");
        } catch (err) {
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome to Movie Finder</h2>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <div style={styles.buttonContainer}>
                    <button onClick={handleRegister} style={{ ...styles.button, ...styles.registerButton }}>
                        Register
                    </button>
                    <button onClick={handleLogin} style={{ ...styles.button, ...styles.loginButton }}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        width: "350px",
        textAlign: "center",
    },
    title: {
        marginBottom: "20px",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "12px",
        margin: "10px 0",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    button: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "0.3s",
        flex: 1,
        margin: "0 5px",
    },
    registerButton: {
        backgroundColor: "#764ba2",
        color: "#fff",
    },
    loginButton: {
        backgroundColor: "#667eea",
        color: "#fff",
    },
};

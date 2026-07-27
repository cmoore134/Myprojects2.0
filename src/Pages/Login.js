import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_FLAG_KEY = "isLoggedIn";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      username === process.env.REACT_APP_LOGIN_USERNAME &&
      password === process.env.REACT_APP_LOGIN_PASSWORD
    ) {
      sessionStorage.setItem(LOGIN_FLAG_KEY, "true");
      if (onLogin) {
        onLogin();
      }
      navigate("/");
      return;
    }

    setError("Invalid username or password. Please try again.");
  };

  return (
    <div style={{ maxWidth: "360px", margin: "60px auto", padding: "16px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <div style={{ color: "red", minHeight: "20px", marginTop: "10px" }}>{error}</div>
    </div>
  );
}

export default Login;

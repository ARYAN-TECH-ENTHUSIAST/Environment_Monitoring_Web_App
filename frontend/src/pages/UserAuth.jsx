import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function UserAuth() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    location: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [pollution, setPollution] = useState(null);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setToken(data.token);
      setMessage("User registered & logged in.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const login = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/login-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setToken(data.token);
      setMessage("User logged in!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const viewPollution = async () => {
    try {
      const res = await fetch(`${API_BASE}/pollution/my-location`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPollution(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        padding: "2rem"
      }}
    >
      <h1>User Login / Register</h1>

      <label>Username</label>
      <input name="username" onChange={handle} />

      <label>Email</label>
      <input name="email" onChange={handle} />

      <label>Location</label>
      <input name="location" onChange={handle} />

      <label>Password</label>
      <input name="password" type="password" onChange={handle} />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={viewPollution}>View Pollution</button>

      <p>{message}</p>

      {pollution && (
        <div>
          <h2>Your Location Pollution</h2>
          <p>SOx: {pollution.sox}</p>
          <p>NOx: {pollution.nox}</p>
          <p>CO: {pollution.co}</p>
          <p>PM: {pollution.pm}</p>
          <p>VOCs: {pollution.vocs}</p>
        </div>
      )}

      <hr />
      <a href="/admin" style={{ color: "yellow" }}>
        Admin Login (side option)
      </a>
    </div>
  );
}

export default UserAuth;

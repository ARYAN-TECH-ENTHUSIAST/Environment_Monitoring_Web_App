import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

function AdminAuth() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/login-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#111827", color: "#fff" }}>
      <h1>ADMIN LOGIN</h1>

      <label>Email</label>
      <input name="email" onChange={handle} />

      <label>Password</label>
      <input name="password" type="password" onChange={handle} />

      <button onClick={login}>Login</button>

      <p>{msg}</p>
    </div>
  );
}

export default AdminAuth;

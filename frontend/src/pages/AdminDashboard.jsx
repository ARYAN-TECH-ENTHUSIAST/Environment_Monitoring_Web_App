import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function AdminDashboard() {
  const [form, setForm] = useState({
    location: "",
    sox: "",
    nox: "",
    co: "",
    pm: "",
    vocs: ""
  });

  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("adminToken");

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/pollution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          sox: Number(form.sox),
          nox: Number(form.nox),
          co: Number(form.co),
          pm: Number(form.pm),
          vocs: Number(form.vocs)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("Pollution data saved!");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#0f172a", color: "#fff" }}>
      <h1>Admin Dashboard</h1>

      <label>Location</label>
      <input name="location" onChange={handle} />

      <label>SOx</label>
      <input name="sox" onChange={handle} />

      <label>NOx</label>
      <input name="nox" onChange={handle} />

      <label>CO</label>
      <input name="co" onChange={handle} />

      <label>PM</label>
      <input name="pm" onChange={handle} />

      <label>VOCs</label>
      <input name="vocs" onChange={handle} />

      <button onClick={submit}>Submit Pollution Data</button>

      <p>{msg}</p>
    </div>
  );
}

export default AdminDashboard;

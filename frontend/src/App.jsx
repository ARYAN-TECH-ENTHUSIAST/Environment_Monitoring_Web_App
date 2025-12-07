import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function App() {
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    location: "",
    password: ""
  });

  const [adminForm, setAdminForm] = useState({
    email: "",
    password: ""
  });

  const [pollutionForm, setPollutionForm] = useState({
    location: "",
    sox: "",
    nox: "",
    co: "",
    pm: "",
    vocs: ""
  });

  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  const [userMessage, setUserMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [pollutionData, setPollutionData] = useState(null);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  // USER REGISTER
  const registerUser = async () => {
    setUserMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "User registration failed");
      setUserToken(data.token);
      setUserMessage("User registered & logged in!");
    } catch (err) {
      setUserMessage(err.message);
    }
  };

  // USER LOGIN
  const loginUser = async () => {
    setUserMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/login-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userForm.email,
          password: userForm.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "User login failed");
      setUserToken(data.token);
      setUserMessage("User logged in!");
    } catch (err) {
      setUserMessage(err.message);
    }
  };

  // ADMIN REGISTER
  const registerAdmin = async () => {
    setAdminMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/register-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Admin registration failed");
      setAdminToken(data.token);
      setAdminMessage("Admin registered & logged in!");
    } catch (err) {
      setAdminMessage(err.message);
    }
  };

  // ADMIN LOGIN
  const loginAdmin = async () => {
    setAdminMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/login-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Admin login failed");
      setAdminToken(data.token);
      setAdminMessage("Admin logged in!");
    } catch (err) {
      setAdminMessage(err.message);
    }
  };

  // ADMIN: SUBMIT POLLUTION
  const submitPollution = async () => {
    if (!adminToken) {
      setAdminMessage("Login as admin first.");
      return;
    }
    setAdminMessage("");
    try {
      const body = {
        ...pollutionForm,
        sox: Number(pollutionForm.sox),
        nox: Number(pollutionForm.nox),
        co: Number(pollutionForm.co),
        pm: Number(pollutionForm.pm),
        vocs: Number(pollutionForm.vocs)
      };

      const res = await fetch(`${API_BASE}/pollution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add data");
      setAdminMessage("Pollution data saved!");
    } catch (err) {
      setAdminMessage(err.message);
    }
  };

  // USER: FETCH POLLUTION FOR THEIR LOCATION
  const fetchMyPollution = async () => {
    if (!userToken) {
      setUserMessage("Login as user first.");
      return;
    }
    setUserMessage("");
    setPollutionData(null);
    try {
      const res = await fetch(`${API_BASE}/pollution/my-location`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch data");
      setPollutionData(data);
    } catch (err) {
      setUserMessage(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e5e7eb",
        padding: "2rem"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Environment Monitoring Web App – Basic Features
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem"
        }}
      >
        {/* USER PANEL */}
        <div
          style={{
            background: "#1e293b",
            padding: "1.5rem",
            borderRadius: "1rem"
          }}
        >
          <h2>User (Public)</h2>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            Register / login with username, email, location & password.
          </p>

          <label>
            Username
            <input
              name="username"
              value={userForm.username}
              onChange={handleChange(setUserForm)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              value={userForm.email}
              onChange={handleChange(setUserForm)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={userForm.location}
              onChange={handleChange(setUserForm)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={userForm.password}
              onChange={handleChange(setUserForm)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <div style={{ display: "flex", gap: "0.5rem", margin: "0.5rem 0" }}>
            <button onClick={registerUser}>Register User</button>
            <button onClick={loginUser}>Login User</button>
          </div>

          <button onClick={fetchMyPollution} style={{ marginTop: "0.5rem" }}>
            View Pollution for My Location
          </button>

          {userMessage && (
            <p style={{ marginTop: "0.5rem", color: "#f97316" }}>
              {userMessage}
            </p>
          )}

          {pollutionData && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "#020617",
                borderRadius: "0.75rem"
              }}
            >
              <h3>Current Pollution Data</h3>
              <p>Location: {pollutionData.location}</p>
              <p>SOx: {pollutionData.sox}</p>
              <p>NOx: {pollutionData.nox}</p>
              <p>CO: {pollutionData.co}</p>
              <p>PM: {pollutionData.pm}</p>
              <p>VOCs: {pollutionData.vocs}</p>
              <p>
                Updated at:{" "}
                {new Date(pollutionData.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* ADMIN PANEL (smaller font) */}
        <div
          style={{
            background: "#111827",
            padding: "1.5rem",
            borderRadius: "1rem",
            fontSize: "0.85rem" // smaller font for admin
          }}
        >
          <h2 style={{ fontSize: "1.1rem" }}>Admin</h2>
          <p style={{ color: "#9ca3af" }}>
            Admin logs in with email & password and submits pollution data for a
            location.
          </p>

          <label>
            Admin Email
            <input
              name="email"
              value={adminForm.email}
              onChange={handleChange(setAdminForm)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <label>
            Admin Password
            <input
              type="password"
              name="password"
              value={adminForm.password}
              onChange={handleChange(setAdminForm)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <div style={{ display: "flex", gap: "0.5rem", margin: "0.5rem 0" }}>
            <button onClick={registerAdmin}>Register Admin</button>
            <button onClick={loginAdmin}>Login Admin</button>
          </div>

          <hr style={{ margin: "1rem 0" }} />

          <h3>Add Pollution Data</h3>

          <label>
            Location
            <input
              name="location"
              value={pollutionForm.location}
              onChange={handleChange(setPollutionForm)}
              style={{ width: "100%", marginBottom: "0.25rem" }}
            />
          </label>
          <label>
            SOx
            <input
              name="sox"
              value={pollutionForm.sox}
              onChange={handleChange(setPollutionForm)}
              style={{ width: "100%", marginBottom: "0.25rem" }}
            />
          </label>
          <label>
            NOx
            <input
              name="nox"
              value={pollutionForm.nox}
              onChange={handleChange(setPollutionForm)}
              style={{ width: "100%", marginBottom: "0.25rem" }}
            />
          </label>
          <label>
            CO
            <input
              name="co"
              value={pollutionForm.co}
              onChange={handleChange(setPollutionForm)}
              style={{ width: "100%", marginBottom: "0.25rem" }}
            />
          </label>
          <label>
            PM
            <input
              name="pm"
              value={pollutionForm.pm}
              onChange={handleChange(setPollutionForm)}
              style={{ width: "100%", marginBottom: "0.25rem" }}
            />
          </label>
          <label>
            VOCs
            <input
              name="vocs"
              value={pollutionForm.vocs}
              onChange={handleChange(setPollutionForm)}
              style={{ width: "100%", marginBottom: "0.25rem" }}
            />
          </label>

          <button onClick={submitPollution} style={{ marginTop: "0.5rem" }}>
            Submit Pollution Data
          </button>

          {adminMessage && (
            <p style={{ marginTop: "0.5rem", color: "#f97316" }}>
              {adminMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


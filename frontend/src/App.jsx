import { Routes, Route } from "react-router-dom";
import UserAuth from "./pages/UserAuth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserAuth />} />
      <Route path="/admin" element={<AdminAuth />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api calls/api";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import background from "../Photos/test4.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { email, password };
    const redirectUrl = await loginUser(userData); // Call loginUser function

    if (redirectUrl) {
      navigate(redirectUrl); // Redirect based on API response
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundImage: `url(${background})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backdropFilter: "blur(5px)" 
      }}
    >
      <div className="p-5 rounded-4 shadow-lg w-100" style={{
        maxWidth: "420px",
        background: "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 51, 102, 0.8))",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        color: "#fff",
        textAlign: "center"
      }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ffcc00", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>Email</label>
            <input type="email" className="form-control rounded-3 border-0 bg-light text-dark"
              value={email} onChange={(e) => setEmail(e.target.value)}  />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>Password</label>
            <input type="password" className="form-control rounded-3 border-0 bg-light text-dark"
              value={password} onChange={(e) => setPassword(e.target.value)}  />
          </div>
          <button type="submit" className="btn w-100 rounded-3" 
            style={{ background: "#ffcc00", border: "none", color: "#000", fontWeight: "bold", boxShadow: "0 4px 7px rgba(255, 204, 0, 0.7)" }}>
            Login
          </button>
        </form>
        <p className="text-center mt-3" style={{ color: "#ffcc00" }}>
          Don't have an account? <Link to="/register" className="text-warning fw-bold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

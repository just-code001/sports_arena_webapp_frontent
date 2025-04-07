import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import background from "../Photos/test4.jpg";
import { sendOtp, verifyOtp, registerUser } from "../api calls/api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    roleId: 3, // Default role
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    const success = await sendOtp(formData.email);
    if (success) setOtpSent(true);
  };

 const handleVerifyOtp = async () => {
  console.log("Email:", formData.email, "OTP:", otp); // Debugging

  if (!formData.email || !otp) {
    alert("Email and OTP are required.");
    return;
  }

  const success = await verifyOtp(formData.email, otp);
  if (success) {
    setOtpVerified(true);
  } else {
    alert("OTP verification failed.");
  }
};

const handleRegister = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify OTP first.");
      return;
    }
  
    const success = await registerUser(formData);
    if (success) {
      navigate("login"); // Redirect only after SweetAlert confirmation
    }
  };
  

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="p-5 rounded-4 shadow-lg w-100"
        style={{
          maxWidth: "420px",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 51, 102, 0.8))",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h2
          className="text-center fw-bold mb-4"
          style={{
            color: "#ffcc00",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Registration
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control rounded-3 border-0 bg-light text-dark"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>
              Phone number
            </label>
            <input
              type="text"
              name="contact"
              className="form-control rounded-3 border-0 bg-light text-dark"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control rounded-3 border-0 bg-light text-dark"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control rounded-3 border-0 bg-light text-dark"
              onChange={handleChange}
              required
            />
          </div>
          {!otpSent ? (
            <button
              type="button"
              className="btn w-100 rounded-3"
              style={{
                background: "#ffcc00",
                border: "none",
                color: "#000",
                fontWeight: "bold",
                boxShadow: "0 4px 7px rgba(255, 204, 0, 0.7)",
              }}
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          ) : !otpVerified ? (
            <>
            <div className="mb-3">
             <label className="form-label" style={{ color: "#ffcc00" }}>
              OTP
            </label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="form-control rounded-3 border-0 bg-light text-dark"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              </div>
              <button
                type="button"
                className="btn w-100 mt-3 rounded-3"
                style={{ background: "#ffcc00", border: "none", color: "#000", fontWeight: "bold" }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="btn w-100 mt-3 rounded-3"
              style={{
                background: "#ffcc00",
                border: "none",
                color: "#000",
                fontWeight: "bold",
                boxShadow: "0 4px 7px rgba(255, 204, 0, 0.7)",
              }}
            >
              Register
            </button>
          )}
        </form>
        <p className="text-center mt-3" style={{ color: "#ffcc00" }}>
          Already have an account? <Link to="/login" className="text-warning fw-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

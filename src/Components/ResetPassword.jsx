import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { resetPassword } from "../api calls/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: pathToken } = useParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryToken = new URLSearchParams(location.search).get("token");
    const finalToken = pathToken || queryToken;

    if (!finalToken) {
      Swal.fire("Invalid Request", "Reset token is missing from the URL.", "error");
      navigate("/login");
    } else {
      setToken(finalToken);
    }
  }, [pathToken, location.search, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire("Missing Fields", "Please fill out both password fields.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Mismatch", "Passwords do not match.", "error");
      return;
    }

    const payload = { token, newPassword, confirmPassword };
    const result = await resetPassword(payload);

    if (result?.success) {
      Swal.fire("Success", result.message, "success").then(() => {
        navigate("/login");
      });
    } else {
      Swal.fire("Error", result?.message || "Failed to reset password.", "error");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3">Reset Your Password</h3>
        <form onSubmit={handleResetPassword}>
          <div className="mb-3 position-relative">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              className="form-control"
              style={{ color: "black" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <i
              className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
              style={{ cursor: "pointer" }}
              onClick={() => setShowNewPassword(!showNewPassword)}
            ></i>
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="form-control"
              style={{ color: "black" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <i
              className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

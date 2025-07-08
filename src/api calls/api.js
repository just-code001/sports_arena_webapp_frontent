import axios from "axios";
import Swal from "sweetalert2";
import { decodeToken } from "../Auth/JwtUtils";

const API_BASE_URL = "https://localhost:7250/api"; // Replace with actual API URL

// Show success alert
export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#ffcc00",
  });
};

// Show error alert
export const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#ffcc00",
  });
};

// Send OTP
export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tblusers/send-otp`, { email },
        { withCredentials: true, headers: { "Content-Type": "application/json" } });
    showSuccess("OTP sent successfully!");
    return true;
  } catch (error) {
    showError(error.response?.data?.message || "Failed to send OTP.");
    return false;
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tblusers/verify-otp`, { email, otp },
        { withCredentials: true });
    showSuccess("OTP verified successfully!");
    return true;
  } catch (error) {
    showError(error.response?.data?.message || "Invalid OTP.");
    return false;
  }
};

// Register User
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tblusers/register`, userData);
      
      // Wait for SweetAlert confirmation before returning success
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Registration successful!",
        confirmButtonColor: "#ffcc00",
      }).then(() => {
        // navigate("/login"); // Redirect after user clicks "OK"
    });
  
      return true; // Proceed with redirection only after SweetAlert is closed
    } catch (error) {
      showError(error.response?.data?.message || "Registration failed.");
      return false;
    }
  };
  

  export const loginUser = async (userData, loginFn) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tblusers/login`, userData);
      const token = response.data.token;
  
      // Save token
      sessionStorage.setItem("token", token);
  
      // Decode token
      const decoded = decodeToken(token);
      sessionStorage.setItem("user", JSON.stringify(decoded));
  
      // ✅ Call AuthContext login()
      if (loginFn) loginFn(token);
  
      // Show success
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
        confirmButtonColor: "#ffcc00",
      });
  
      // Role-based redirect
      const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase();
      switch (role) {
        case "admin":
          return "/admin/dashboard";
        case "provider":
          return "/provider/dashboard";
        case "user":
          return "/user/dashboard";
        default:
          return "/";
      }
    } catch (error) {
      showError("Invalid Email or Password");
      return null;
    }
  };

export const sendForgotPasswordEmail = async (email) => {
  try {
    const response = await axios.post(
      "https://localhost:7250/api/Tblusers/forgot-password", // update base URL
      { email },
      {
        headers: {
          'Content-Type': 'application/json' // ✅ REQUIRED to avoid 415
        }
      }
    );

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Email Sent',
        text: response.data.message,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: response.data.message || "Something went wrong!",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Failed to send reset password email.',
    });
  }
};

export const resetPassword = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Tblusers/reset-password`, payload);
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    return error.response?.data || { success: false, message: "Something went wrong." };
  }
};  
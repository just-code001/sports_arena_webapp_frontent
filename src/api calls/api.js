import axios from "axios";
import Swal from "sweetalert2";

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
  

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tblusers/login`, userData);
    sessionStorage.setItem("token", response.data.token);
    sessionStorage.setItem("roleId", response.data.roleId);
    showSuccess("Login successful!");
    return response.data.redirectUrl;
  } catch (error) {
    showError("Invalid Email or Password");
    return null;
  }
};

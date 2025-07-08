"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser, sendForgotPasswordEmail } from "../api calls/api"
import Swal from "sweetalert2"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { AuthContext } from "../Auth/context/AuthContext"

const Login = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({ email: false, password: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Email validation function
  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return undefined
  }

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    return undefined
  }

  // Live validation effect
  useEffect(() => {
    const newErrors = {}

    if (touched.email) {
      const emailError = validateEmail(email)
      if (emailError) newErrors.email = emailError
    }

    if (touched.password) {
      const passwordError = validatePassword(password)
      if (passwordError) newErrors.password = passwordError
    }

    setErrors(newErrors)
  }, [email, password, touched])

  // Handle field blur (when user leaves the field)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Validate entire form
  const validateForm = () => {
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    const newErrors = {}
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    setTouched({ email: true, password: true })

    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const userData = { email: email.trim(), password }
      const redirectUrl = await loginUser(userData, login)
      if (redirectUrl) {
        navigate(redirectUrl)
      }
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Forgot Password",
      input: "email",
      inputLabel: "Enter your registered email",
      inputPlaceholder: "Enter your email address",
      showCancelButton: true,
      confirmButtonText: "Send Reset Email",
      confirmButtonColor: "#10b981",
      background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(6, 78, 59, 0.9))",
      color: "#fff",
      inputValidator: (value) => {
        if (!value) {
          return "Email is required"
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address"
        }
        return null
      },
    })

    if (email) {
      await sendForgotPasswordEmail(email)
    }
  }

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && email.trim() && password

  return (
    <div className="sports-bg min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="glass-card p-5 text-center">
              {/* Logo and Welcome */}
              <div className="mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "65px",
                    height: "65px",
                    background: "linear-gradient(135deg, #10b981, #f59e0b)",
                    borderRadius: "18px",
                    color: "#fff",
                    fontSize: "26px",
                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  🏟️
                </div>
                <h3 className="fw-bold mb-2" style={{ color: "#10b981" }}>
                  Welcome Back
                </h3>
                <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                  Sign in to your Sports Arena account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} noValidate>
                {/* Email Field */}
                <div className="mb-3 text-start">
                  <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : touched.email && !errors.email ? "is-valid" : ""}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: errors.email
                        ? "1px solid #dc3545"
                        : touched.email && !errors.email
                          ? "1px solid #28a745"
                          : "1px solid rgba(255, 255, 255, 0.3)",
                      color: "#fff",
                    }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.email}
                    </div>
                  )}
                  {touched.email && !errors.email && email && (
                    <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Email looks good!
                    </div>
                  )}
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="mb-4 text-start position-relative">
                  <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : touched.password && !errors.password ? "is-valid" : ""}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: errors.password
                          ? "1px solid #dc3545"
                          : touched.password && !errors.password
                            ? "1px solid #28a745"
                            : "1px solid rgba(255, 255, 255, 0.3)",
                        color: "#fff",
                        paddingRight: "45px",
                      }}
                    />
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                      style={{
                        cursor: "pointer",
                        color: "#aaa",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.password}
                    </div>
                  )}
                  {touched.password && !errors.password && password && (
                    <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Password meets requirements!
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-yellow w-100 mb-3"
                  style={{ padding: "14px" }}
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Forgot Password */}
              <div className="text-center mb-4">
                <button
                  className="btn btn-link p-0"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  style={{
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#10b981",
                  }}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-white-50 mb-2" style={{ fontSize: "14px" }}>
                  Don't have an account?
                </p>
                <Link
                  to="/register"
                  className="btn"
                  style={{
                    borderRadius: "10px",
                    padding: "10px 26px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "1px solid #10b981",
                    color: "#10b981",
                    background: "rgba(16, 185, 129, 0.15)",
                  }}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

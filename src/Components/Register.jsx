"use client"

import { useState, useEffect } from "react"
import { sendOtp, verifyOtp, registerUser } from "../api calls/api"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    roleId: 3,
  })

  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({
    name: false,
    contact: false,
    email: false,
    password: false,
    otp: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Full name is required"
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long"
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters"
    }
    const nameRegex = /^[a-zA-Z\s]+$/
    if (!nameRegex.test(name.trim())) {
      return "Name can only contain letters and spaces"
    }
    return undefined
  }

  const validateContact = (contact) => {
    if (!contact.trim()) {
      return "Phone number is required"
    }
    // Remove all non-digit characters for validation
    const cleanContact = contact.replace(/\D/g, "")
    if (cleanContact.length < 10) {
      return "Phone number must be at least 10 digits"
    }
    if (cleanContact.length > 15) {
      return "Phone number must be less than 15 digits"
    }
    // Basic phone number pattern (supports various formats)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(cleanContact)) {
      return "Please enter a valid phone number"
    }
    return undefined
  }

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    if (email.length > 100) {
      return "Email must be less than 100 characters"
    }
    return undefined
  }

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (password.length > 100) {
      return "Password must be less than 100 characters"
    }

    // Password strength checks
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter"
    }
    if (!hasNumbers) {
      return "Password must contain at least one number"
    }

    return undefined
  }

  const validateOtp = (otp) => {
    if (!otp.trim()) {
      return "OTP is required"
    }
    if (otp.trim().length !== 6) {
      return "OTP must be 6 digits"
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      return "OTP must contain only numbers"
    }
    return undefined
  }

  // Live validation effect
  useEffect(() => {
    const newErrors = {}

    if (touched.name) {
      const nameError = validateName(formData.name)
      if (nameError) newErrors.name = nameError
    }

    if (touched.contact) {
      const contactError = validateContact(formData.contact)
      if (contactError) newErrors.contact = contactError
    }

    if (touched.email) {
      const emailError = validateEmail(formData.email)
      if (emailError) newErrors.email = emailError
    }

    if (touched.password) {
      const passwordError = validatePassword(formData.password)
      if (passwordError) newErrors.password = passwordError
    }

    if (touched.otp && otpSent) {
      const otpError = validateOtp(otp)
      if (otpError) newErrors.otp = otpError
    }

    setErrors(newErrors)
  }, [formData, otp, touched, otpSent])

  // Handle field blur
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target

    // Format phone number as user types
    if (name === "contact") {
      // Remove all non-digit characters
      const cleanValue = value.replace(/\D/g, "")
      // Format as (XXX) XXX-XXXX for US numbers, or keep as is for international
      let formattedValue = cleanValue
      if (cleanValue.length >= 6) {
        formattedValue = `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`
      } else if (cleanValue.length >= 3) {
        formattedValue = `(${cleanValue.slice(0, 3)}) ${cleanValue.slice(3)}`
      }
      setFormData({ ...formData, [name]: formattedValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Validate form for OTP sending
  const validateFormForOtp = () => {
    const nameError = validateName(formData.name)
    const contactError = validateContact(formData.contact)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    const newErrors = {}
    if (nameError) newErrors.name = nameError
    if (contactError) newErrors.contact = contactError
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    setTouched({ name: true, contact: true, email: true, password: true, otp: false })

    return Object.keys(newErrors).length === 0
  }

  // Handle send OTP
  const handleSendOtp = async () => {
    if (!validateFormForOtp()) {
      return
    }

    setIsSendingOtp(true)
    try {
      const success = await sendOtp(formData.email.trim())
      if (success) {
        setOtpSent(true)
      }
    } catch (error) {
      console.error("Failed to send OTP:", error)
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpError = validateOtp(otp)
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }))
      setTouched((prev) => ({ ...prev, otp: true }))
      return
    }

    setIsVerifyingOtp(true)
    try {
      const success = await verifyOtp(formData.email.trim(), otp.trim())
      if (success) {
        setOtpVerified(true)
        setErrors((prev) => ({ ...prev, otp: undefined }))
      } else {
        setErrors((prev) => ({ ...prev, otp: "Invalid or expired OTP" }))
        setTouched((prev) => ({ ...prev, otp: true }))
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
      setErrors((prev) => ({ ...prev, otp: "OTP verification failed" }))
      setTouched((prev) => ({ ...prev, otp: true }))
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault()

    if (!otpVerified) {
      alert("Please verify OTP first.")
      return
    }

    setIsSubmitting(true)
    try {
      // Clean the contact number before sending
      const cleanContact = formData.contact.replace(/\D/g, "")
      const registrationData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        contact: cleanContact,
      }

      const success = await registerUser(registrationData)
      if (success) {
        navigate("/login")
      }
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if form is valid for OTP
  const isFormValidForOtp =
    Object.keys(errors).filter((key) => key !== "otp").length === 0 &&
    formData.name.trim() &&
    formData.contact.trim() &&
    formData.email.trim() &&
    formData.password

  // Check if OTP is valid
  const isOtpValid = !errors.otp && otp.trim().length === 6

  // Get password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" }

    let strength = 0
    const checks = {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    strength = Object.values(checks).filter(Boolean).length

    if (strength <= 2) return { strength, text: "Weak", color: "#dc3545" }
    if (strength <= 3) return { strength, text: "Fair", color: "#ffc107" }
    if (strength <= 4) return { strength, text: "Good", color: "#17a2b8" }
    return { strength, text: "Strong", color: "#28a745" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="sports-bg min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="glass-card p-5 text-center">
              {/* Logo & Heading */}
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
                  Join Sports Arena
                </h3>
                <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                  Create your account to start booking venues
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} noValidate>
                {/* Full Name */}
                <div className="mb-3 text-start">
                  <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : touched.name && !errors.name ? "is-valid" : ""}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    disabled={otpSent || isSubmitting}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: errors.name
                        ? "1px solid #dc3545"
                        : touched.name && !errors.name
                          ? "1px solid #28a745"
                          : "1px solid rgba(255, 255, 255, 0.3)",
                      color: "#fff",
                    }}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.name}
                    </div>
                  )}
                  {touched.name && !errors.name && formData.name && (
                    <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Name looks good!
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="mb-3 text-start">
                  <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    className={`form-control ${errors.contact ? "is-invalid" : touched.contact && !errors.contact ? "is-valid" : ""}`}
                    placeholder="Enter your phone number"
                    value={formData.contact}
                    onChange={handleChange}
                    onBlur={() => handleBlur("contact")}
                    disabled={otpSent || isSubmitting}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: errors.contact
                        ? "1px solid #dc3545"
                        : touched.contact && !errors.contact
                          ? "1px solid #28a745"
                          : "1px solid rgba(255, 255, 255, 0.3)",
                      color: "#fff",
                    }}
                  />
                  {errors.contact && (
                    <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.contact}
                    </div>
                  )}
                  {touched.contact && !errors.contact && formData.contact && (
                    <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Phone number is valid!
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="mb-3 text-start">
                  <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : touched.email && !errors.email ? "is-valid" : ""}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    disabled={otpSent || isSubmitting}
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
                  {touched.email && !errors.email && formData.email && (
                    <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Email looks good!
                    </div>
                  )}
                </div>

                {/* Password with toggle and strength indicator */}
                <div className="mb-4 text-start position-relative">
                  <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-control ${errors.password ? "is-invalid" : touched.password && !errors.password ? "is-valid" : ""}`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      disabled={otpSent || isSubmitting}
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small style={{ color: passwordStrength.color, fontSize: "12px" }}>
                          Password Strength: {passwordStrength.text}
                        </small>
                        <small className="text-white-50" style={{ fontSize: "12px" }}>
                          {formData.password.length}/100
                        </small>
                      </div>
                      <div className="progress" style={{ height: "4px" }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.password}
                    </div>
                  )}
                  {touched.password && !errors.password && formData.password && (
                    <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Password meets requirements!
                    </div>
                  )}
                </div>

                {/* OTP Logic */}
                {!otpSent ? (
                  <button
                    type="button"
                    className="btn btn-yellow w-100 mb-4"
                    onClick={handleSendOtp}
                    disabled={!isFormValidForOtp || isSendingOtp}
                    style={{ padding: "14px" }}
                  >
                    {isSendingOtp ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending Code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>
                ) : !otpVerified ? (
                  <>
                    <div className="mb-3 text-start">
                      <label className="form-label text-white fw-medium" style={{ fontSize: "14px" }}>
                        Enter OTP <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.otp ? "is-invalid" : touched.otp && !errors.otp ? "is-valid" : ""}`}
                        placeholder="Enter the 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        onBlur={() => handleBlur("otp")}
                        disabled={isVerifyingOtp}
                        maxLength={6}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: errors.otp
                            ? "1px solid #dc3545"
                            : touched.otp && !errors.otp
                              ? "1px solid #28a745"
                              : "1px solid rgba(255, 255, 255, 0.3)",
                          color: "#fff",
                          textAlign: "center",
                          fontSize: "18px",
                          letterSpacing: "2px",
                        }}
                      />
                      {errors.otp && (
                        <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.otp}
                        </div>
                      )}
                      {touched.otp && !errors.otp && otp && (
                        <div className="valid-feedback d-block" style={{ fontSize: "12px" }}>
                          <i className="bi bi-check-circle me-1"></i>
                          OTP format is correct!
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-success w-100 mb-4"
                      onClick={handleVerifyOtp}
                      disabled={!isOtpValid || isVerifyingOtp}
                      style={{ padding: "14px" }}
                    >
                      {isVerifyingOtp ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-yellow w-100 mb-4"
                    style={{ padding: "14px" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Register Account"
                    )}
                  </button>
                )}
              </form>

              {/* Login Redirect */}
              <p className="text-white-50 mt-3" style={{ fontSize: "14px" }}>
                Already have an account?{" "}
                <Link to="/login" className="fw-semibold text-success text-decoration-none">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

import React, { useState, useEffect } from "react";
import {
  IoArrowForwardCircleSharp,
  IoArrowBackCircleSharp,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../../Services/userApi";
import { OtpForUserRegistration } from "../../../Services/userApi";
import Apple from "../../../Images/LoginWith/apple.png";
import Linkedin from "../../../Images/LoginWith/Linkedin.png";
import Google from "../../../Images/LoginWith/Google.png";
import logo from "../../../Images/LoginWith/neo_tokyo-logo.png";
import OtpInput from "../OtpSubmit/otp";
import { submitOTP } from "../../../Services/userApi";
import Alert from "../Alert/Alert";
import Pro from "../../../Images/pro.jpg";
import GoogleLoginComponent from "../../user/Google/GoogleLoginComponent";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../Context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [googleAuth, setGoogleAuth] = useState(false);
  const [sentingotp, setsentingtOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const LoginWith = async (data) => {
    try {
      setGoogleAuth(true);
      navigate("/GoogleAuth");
    } catch (error) {
      console.log(error);
    }
  };
  const [formDataPass, setFormDataPass] = useState({
    password: "",
    cpassword: "",
  });
  const [validationState, setValidationState] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  const [showValidation, setShowValidation] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    pin_code: "",
    age: "",
    district: "",
    state: "",
    address: "",
    role: "user",
  });

  // Function to validate if phone number follows the rules
  const isValidPhoneNumber = (phone) => {
    // Check if phone number exists and has the correct length
    if (!phone) return false;

    // Check if it's only digits
    const isDigitsOnly = /^\d+$/.test(phone);

    // Check if length is between 10 and 12
    const isCorrectLength = phone.length >= 10 && phone.length <= 12;

    return isDigitsOnly && isCorrectLength;
  };

  // Update validation state whenever password changes
  useEffect(() => {
    setValidationState({
      hasMinLength: formData.password.length >= 8,
      hasNumber: /\d/.test(formData.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      passwordsMatch:
        formData.password === formData.cpassword && formData.password !== "",
    });
  }, [formData]);

  const handleChangeOTP = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendOTP = async () => {
    const email = formData.email;

    if (email === "") {
      setMessage("Please enter an email");
      setsentingtOtp(false);
      return;
    }

    localStorage.setItem("email", email);

    // Show loading state
    // setsentingtOtp(true);

    let result = await submitOTP(email);

    if (result.success) {
      // OTP sent successfully
      setMessage("OTP sent successfully");
      setShowEmailInput(false);
      setTimeout(() => {
        // Keep the sending OTP state true to show the OTP input screen
        setsentingtOtp(true);
      }, 300);
    } else {
      // Handle error cases
      setsentingtOtp(false);
      setShowEmailInput(true);
      if (result.isActive === false) {
        // User is inactive
        setMessage("This user is inactive. Please contact administrator.");
      } else {
        // Other errors
        setMessage(
          result.errorMessage || "Something went wrong. Please try again."
        );
      }
    }
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentField, setCurrentField] = useState("email");
  const [formFieldsVisible, setFormFieldsVisible] = useState({
    email: true,
    password: false,
    terms: false,
    first_name: false,

    phone_number: false,
    otp: false,
    date_of_birth: false,
    pin_code: false,
    district: false,
    state: false,
    address: false,
    submit: false,
  });

  const registrationFields = ["email", "password", "terms", "otp"];

  const calculateProgress = () => {
    const currentIndex = registrationFields.indexOf(currentField);
    if (currentIndex === -1) return 0;
    return (currentIndex / (registrationFields.length - 1)) * 100;
  };

  useEffect(() => {
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  }, [formData.date_of_birth]);

  // Modified handlePhoneChange function to only allow digits and validate length
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;

    // Only allow digits
    if (name === "phone_number") {
      // Filter out non-digit characters
      const numericValue = value.replace(/\D/g, "");

      // Update form data with filtered value
      setFormData({
        ...formData,
        [name]: numericValue,
      });

      // Validate and set error messages
      if (numericValue && !/^\d+$/.test(numericValue)) {
        setPhoneError("Only numbers are allowed");
      } else if (
        numericValue &&
        (numericValue.length < 10 || numericValue.length > 12)
      ) {
        setPhoneError("Phone number must be 10-12 digits");
      } else {
        setPhoneError("");
      }
    } else {
      // Handle other form fields normally
      handleChange(e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!showValidation && name === "password" && value.length > 0) {
      setShowValidation(true);
    }
  };

  const isPasswordValid = () => {
    return (
      validationState.hasMinLength &&
      validationState.hasNumber &&
      validationState.hasSpecialChar
    );
  };

  const isFormValid = () => {
    return isPasswordValid() && validationState.passwordsMatch;
  };

  const moveToPrevious = () => {
    console.log("Move to previous field");
  };

  const moveToNext = () => {
    if (isFormValid()) {
      console.log("Move to next field");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const registrationData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      phone_number: formData.phone_number,
      role: "user",
    };

    console.log("Registration Data:", registrationData);
    try {
      let response = await RegisterUser(registrationData);
      console.log(response, "response from register user");

      if (response.status === 400) {
        console.log(response.response.data, "error message");
        setErrorMessage(response.response.data.detail);
        // Stay on the current page and display the error message
      } else {
        // OTP is sent automatically by the backend after registration
        setMessage(
          "Registration successful! Please enter the OTP sent to your email."
        );
        moveToNextField(); // Move to OTP field
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      // Set loading to false when submission completes (whether success or error)
      setIsLoading(false);
    }
  };

  // Add a function to handle OTP verification
  const verifyOTPRegistration = async (e) => {
    e.preventDefault();

    // Clear any previous messages
    setErrorMessage("");
    setMessage("");

    if (!formData.otp) {
      setErrorMessage("Please enter the verification code");
      return;
    }

    const otpData = {
      otp: formData.otp,
      identifier: formData.email,
    };

    console.log("OTP Data:", otpData);

    try {
      // Call your OTP verification API
      const response = await OtpForUserRegistration(otpData);
      console.log(response, "response from OTP verification");

      if (response.status === 200 || response.status === 201) {
        // OTP verification successful
        setMessage("Verification successful!");

        // Store token in localStorage and set in context
        const data = response.data;
        localStorage.setItem("refresh", data.refresh);

        // Use the Auth context to set the token
        if (setToken) {
          setToken(data.access);
        }

        // Set a brief delay before redirecting to home page
        setTimeout(() => {
          if (navigate) {
            navigate("/");
          } else {
            // Fallback if navigate is not available
            window.location.href = "/";
          }
        }, 1000);
      } else {
        setErrorMessage(
          response.data?.detail || "Invalid OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMessage(
        error.response?.data?.detail || "Error verifying OTP. Please try again."
      );
    }
  };

  const moveToNextField = () => {
    const currentIndex = registrationFields.indexOf(currentField);
    if (currentIndex < registrationFields.length - 1) {
      const nextField = registrationFields[currentIndex + 1];
      setCurrentField(nextField);

      setFormFieldsVisible((prev) => {
        const updated = { ...prev };
        for (let i = 0; i <= currentIndex + 1; i++) {
          updated[registrationFields[i]] = true;
        }
        return updated;
      });
    }
  };

  const moveToPreviousField = () => {
    const currentIndex = registrationFields.indexOf(currentField);
    if (currentIndex > 0) {
      setCurrentField(registrationFields[currentIndex - 1]);
    }
  };

  const getStepFromField = (field) => {
    if (["first_name", "email", "phone_number"].includes(field)) return 1;
    if (["password", "cpassword"].includes(field)) return 2;
    if (["terms"].includes(field)) return 3;
    if (["otp"].includes(field)) return 4;
    return 1;
  };

  const getCurrentStep = () => {
    return getStepFromField(currentField);
  };

  const isFieldValid = (fieldName) => {
    if (fieldName === "terms") return agreedToTerms;
    if (fieldName === "submit") return true;
    if (fieldName === "last_name") return true;
    if (fieldName === "address") return true;
    return !!formData[fieldName];
  };

  const renderSequentialRegistration = () => {
    const currentStep = getCurrentStep();

    return (
      <div className="w-full max-w-md mx-auto" style={{ minHeight: "600px" }}>
        {/* Step indicator */}
        <div className="flex flex-col mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Headings */}
        <div className="mb-6">
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                What's Your Basic Information
              </h2>
              <p className="text-gray-600">
                Psst.. It's a secret. we've got your back
              </p>
            </>
          )}
          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Set Your Secret</h2>
              <p className="text-gray-600">Set Your Secret Password Now</p>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Please Agree Terms</h2>
              <p className="text-gray-600">Almost there!</p>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                We are not verified You
              </h2>
              <p className="text-gray-600">
                We've sent a verification code to your email address.
              </p>
            </>
          )}
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {formFieldsVisible.email && (
            <div
              className={`relative ${currentField === "email" ? "" : "hidden"}`}
            >
              <div className="relative" style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  id="FirstNameInput"
                  required
                  className="w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderRadius: "20px",
                    border: "2px solid black",
                    padding: "1rem 0.4rem 0.5rem 0.4rem",
                  }}
                />
                <label
                  htmlFor="FirstNameInput"
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    formData.first_name
                      ? "text-xs top-1 text-gray-600"
                      : "text-base top-3 text-gray-400"
                  }`}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Name
                </label>
              </div>

              <div className="relative" style={{ marginTop: "10px" }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="regEmail"
                  required
                  className="w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "lightgray",
                    padding: "1rem 0.4rem 0.5rem 0.4rem",
                  }}
                />
                <label
                  htmlFor="regEmail"
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    formData.email
                      ? "text-xs top-1 text-gray-600"
                      : "text-base top-3 text-gray-400"
                  }`}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Email ID
                </label>
              </div>

              <div className="relative" style={{ marginTop: "10px" }}>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  id="tel"
                  required
                  className="w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderRadius: "20px",
                    padding: "1rem 0.4rem 0.5rem 0.4rem",
                    backgroundColor: "lightgray",
                    borderColor: phoneError ? "red" : "transparent",
                    borderWidth: phoneError ? "2px" : "0px",
                  }}
                />
                <label
                  htmlFor="tel"
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    formData.phone_number
                      ? "text-xs top-1 text-gray-600"
                      : "text-base top-3 text-gray-400"
                  }`}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Phone Number
                </label>
                {phoneError && (
                  <div className="text-red-500 text-xs mt-1 ml-2">
                    {phoneError}
                  </div>
                )}
              </div>

              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <button
                  disabled={
                    !(
                      isFieldValid("email") &&
                      isFieldValid("phone_number") &&
                      isFieldValid("first_name") &&
                      isValidPhoneNumber(formData.phone_number)
                    )
                  }
                  style={{
                    backgroundColor:
                      isFieldValid("email") &&
                      isFieldValid("phone_number") &&
                      isFieldValid("first_name") &&
                      isValidPhoneNumber(formData.phone_number)
                        ? "black"
                        : "#999",
                    height: "40px",
                    width: "200px",
                    borderRadius: "20px",
                    marginTop: "15px",
                    opacity:
                      isFieldValid("email") &&
                      isFieldValid("phone_number") &&
                      isFieldValid("first_name") &&
                      isValidPhoneNumber(formData.phone_number)
                        ? "1"
                        : "0.7",
                    cursor:
                      isFieldValid("email") &&
                      isFieldValid("phone_number") &&
                      isFieldValid("first_name") &&
                      isValidPhoneNumber(formData.phone_number)
                        ? "pointer"
                        : "not-allowed",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingRight: "40px",
                  }}
                  className="text-white px-3 py-1 rounded text-sm transition-colors"
                  onClick={moveToNextField}
                >
                  Next
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      height: "100%",
                      width: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {formFieldsVisible.password && (
            <div
              className={`relative ${
                currentField === "password" ? "" : "hidden"
              }`}
            >
              {/* {currentField === "password" && (
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={moveToPreviousField}
                >
                  <IoArrowBackCircleSharp className="text-xl" />
                </button>
              )} */}
              <div className="relative mb-6">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  id="password"
                  required
                  className="w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl border-2 border-black"
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.password
                      ? "text-xs top-1 text-gray-600"
                      : "text-base top-3 text-gray-400"
                  }`}
                >
                  Enter Password
                </label>
              </div>

              {showValidation && (
                <div className="mb-4 bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Password requirements:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li
                      className={`flex items-center ${
                        validationState.hasMinLength
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-2">
                        {validationState.hasMinLength ? "✓" : "✗"}
                      </span>
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        validationState.hasNumber
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-2">
                        {validationState.hasNumber ? "✓" : "✗"}
                      </span>
                      At least one number
                    </li>
                    <li
                      className={`flex items-center ${
                        validationState.hasSpecialChar
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-2">
                        {validationState.hasSpecialChar ? "✓" : "✗"}
                      </span>
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}

              <div className="relative mb-6">
                <input
                  type="password"
                  name="cpassword"
                  value={formData.cpassword}
                  onChange={handleChange}
                  id="cpassword"
                  required
                  className={`w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl bg-gray-200 ${
                    formData.cpassword && !validationState.passwordsMatch
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                />
                <label
                  htmlFor="cpassword"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.cpassword
                      ? "text-xs top-1 text-gray-600"
                      : "text-base top-3 text-gray-400"
                  }`}
                >
                  Confirm Password
                </label>
                {formData.cpassword && !validationState.passwordsMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <button
                  className="bg-black text-white rounded-full h-10 flex-1 flex items-center justify-center relative"
                  onClick={moveToPreviousField}
                >
                  <div className="absolute left-0 h-full w-10 flex items-center justify-center">
                    <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 12H5M5 12L12 5M5 12L12 19"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-5">Previous</span>
                </button>

                <button
                  className={`rounded-full h-10 flex-1 flex items-center justify-center relative ${
                    isFormValid()
                      ? "bg-black text-white"
                      : "bg-gray-400 text-white opacity-70"
                  }`}
                  onClick={moveToNextField}
                  disabled={!isFormValid()}
                >
                  <span className="mr-5">Next</span>
                  <div className="absolute right-0 h-full w-10 flex items-center justify-center">
                    <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {formFieldsVisible.terms && (
            <div
              className={`relative ${currentField === "terms" ? "" : "hidden"}`}
            >
              {/* {currentField === "terms" && (
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={moveToPreviousField}
                >
                  <IoArrowBackCircleSharp className="text-xl" />
                </button>
              )} */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="terms"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-600">
                  Yes; NEO TOKYO may use and share my email to enable
                  personalized advertising with third parties (e.g. Google,
                  Twitch) and to send me info about new releases, updates,
                  events, or other related content.
                </span>
              </div>
              {/* {currentField === "terms" && isFieldValid("terms") && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                  onClick={moveToNextField}
                >
                  <IoArrowForwardCircleSharp className="text-2xl" />
                </button>
              )} */}

              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wap",
                  gap: "20px",
                }}
              >
                <button
                  style={{
                    backgroundColor: "black",
                    height: "40px",
                    width: "200px",
                    borderRadius: "20px",
                    marginTop: "15px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: "40px", // Make room for the arrow circle
                  }}
                  className="text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  onClick={moveToPreviousField}
                >
                  {/* Arrow circle positioned on the left side */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      height: "100%", // Full height of button
                      width: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Black arrow pointing left */}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 12H5M5 12L12 5M5 12L12 19"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  Previous
                </button>

                <button
                  style={{
                    backgroundColor: isFieldValid("terms") ? "black" : "#999", // Gray color when disabled
                    height: "40px",
                    width: "200px",
                    borderRadius: "20px",
                    marginTop: "15px",
                    opacity: isFieldValid("terms") ? "1" : "0.7", // Reduced opacity when disabled
                    cursor: isFieldValid("terms") ? "pointer" : "not-allowed",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingRight: "40px", // Make room for the arrow circle
                  }}
                  className="text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  disabled={!isFieldValid("terms") || isLoading} // Also disable when loading
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    // Loading spinner when in loading state
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    // Normal button content when not loading
                    "Confirm"
                  )}

                  {!isLoading && (
                    // Only show the arrow when not loading
                    <div
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        height: "100%", // Full height of button
                        width: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Black arrow pointing right */}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {formFieldsVisible.otp && (
            <div
              className={`relative ${currentField === "otp" ? "" : "hidden"}`}
            >
              <div className="text-center mb-4">
                {/* <h3 className="text-lg font-medium">Verification Code</h3>
                <p className="text-sm text-gray-600">
                  We've sent a verification code to your email address.
                </p> */}

                {/* Display success or error messages */}
                {message && (
                  <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-lg">
                    {message}
                  </div>
                )}
                {errorMessage && (
                  <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="relative" style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  id="otp"
                  required
                  className="w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    borderRadius: "20px",
                    border: "2px solid black",
                    backgroundColor: "white",
                    textAlign: "center",
                    padding: "1rem 0.4rem 0.5rem 0.4rem",
                    fontSize: "18px",
                    letterSpacing: "0.5em", // Add spacing between characters for better OTP readability
                  }}
                  maxLength="6" // Assuming 6-digit OTP
                />
                <label
                  htmlFor="otp"
                  className={`absolute left-0 right-0 text-center transition-all duration-200 pointer-events-none ${
                    formData.otp
                      ? "text-xs top-1 text-gray-600"
                      : "text-base top-3 text-gray-400"
                  }`}
                >
                  Enter OTP
                </label>
              </div>

              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "center", // Changed to center for single button
                  flexWrap: "wrap",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <button
                  style={{
                    backgroundColor: formData.otp ? "black" : "#999",
                    height: "40px",
                    width: "200px",
                    borderRadius: "20px",
                    opacity: formData.otp ? "1" : "0.7",
                    cursor: formData.otp ? "pointer" : "not-allowed",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  disabled={!formData.otp}
                  onClick={verifyOTPRegistration}
                >
                  SUBMIT
                </button>
              </div>

              <div className="mt-4 text-center">
                <button className="text-blue-600 text-sm">
                  Didn't receive a code? Resend
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!sentingotp && (
              <motion.div
                key="social-login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="my-6"
              >
                {/* OR Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <p className="text-center text-gray-500 text-sm uppercase tracking-wider px-4">
                    OR
                  </p>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex justify-center space-x-6">
                  <GoogleLoginComponent />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ALREADY HAVE AN ACCOUNT?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-medium"
              >
                SIGN IN
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full mx-auto shadow-xl rounded-xl overflow-hidden bg-white flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="md:w-1/2 relative text-white p-8 flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <div
              className="inset-0 bg-white opacity-70 backdrop-blur-md"
              style={{
                width: "100%",
                position: "absolute",
                height: "100%",
                backdropFilter: "blur(8px)",
              }}
            ></div>
            <div className="w-full h-full bg-black opacity-60 absolute z-10"></div>
            <a href="/">
              <img
                src={Pro}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </a>
          </div>

          <div className="mb-8 relative z-20" style={{ minHeight: "200px" }}>
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                className="h-12 absolute"
                style={{ opacity: ".6" }}
              />
            </a>

            <div
              className="text-center md:text-left absolute"
              style={{ top: "60%", left: "10%" }}
            >
              <p
                className=" md:text-3xl tracking-tight  text-black"
                style={{
                  // fontFamily: "'Bebas Neue', 'Oswald', 'Barlow Condensed', sans-serif",
                  fontFamily: "Barlow Condensed, sans-serif",
                  letterSpacing: "4px",
                  lineHeight: "40px",
                  fontWeight: "300",
                  textTransform: "uppercase",
                  // textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                  textShadow: "2px 2px 6px rgba(3, 3, 3, 0.57)",
                  fontSize: "40px",
                }}
              >
                NEW THINKING
                <br />
                ENDLESS POSSIBILITIES
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="md:w-1/2 p-8 flex flex-col justify-center"
          style={{ minHeight: "600px" }}
        >
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`px-6 py-2 rounded-full transition-colors ${
                isLogin
                  ? "bg-black text-yellow-500 hover:bg-gray-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-colors ${
                !isLogin
                  ? "bg-black text-yellow-500 hover:bg-gray-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setIsLogin(false);
                setCurrentField("email");
                setFormFieldsVisible({
                  email: true,
                  password: false,
                  terms: false,
                  first_name: false,
                  last_name: false,
                  phone_number: false,
                  date_of_birth: false,
                  pin_code: false,
                  district: false,
                  state: false,
                  address: false,
                  submit: false,
                });
              }}
            >
              Register
            </button>
          </div>

          {sentingotp && (
            <div className="mb-4">
              <Alert
                type="success"
                message="OTP sent successfully!"
                productId={null}
              />
            </div>
          )}

          {message && (
            <div className="mb-4">
              <Alert type="success" message={message} productId={null} />
            </div>
          )}
          {errorMessage && (
            <div className="mb-4">
              <Alert type="error" message={errorMessage} productId={null} />
            </div>
          )}
          {isLogin ? (
            <div
              className="max-w-md w-full login-container"
              style={{ minHeight: "300px", margin: "auto", marginTop: "50px" }}
            >
              <h2 className="text-2xl font-bold mb-6 text-left">Login</h2>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {showEmailInput && (
                    <motion.div
                      key="email-input"
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      {/* Replace your current input with this code */}
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChangeOTP}
                          id="emailInput"
                          className="w-full pt-5 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            borderRadius: "20px",
                            border: "2px solid black",
                            padding: "1rem 0.4rem 0.5rem 0.4rem",
                          }}
                        />
                        <label
                          htmlFor="emailInput"
                          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                            formData.email
                              ? "text-xs top-1 text-gray-600"
                              : "text-base top-3 text-gray-400"
                          }`}
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Email
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {showEmailInput && (
                    <motion.div
                      key="otp-button"
                      initial={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-xl"
                    >
                      <button
                        onClick={handleSendOTP}
                        style={{
                          backgroundColor: "black",
                          height: "40px",
                          width: "200px",
                          borderRadius: "20px",
                        }}
                        className="top-1/2 transform -translate-y-1/2 bg- text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Generate OTP
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {sentingotp && (
                    <motion.div
                      key="otp-input"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <OtpInput />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {!sentingotp && (
                    <motion.div
                      key="social-login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="my-6"
                    >
                      {/* OR Divider */}
                      <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <p className="text-center text-gray-500 text-sm uppercase tracking-wider px-4">
                          OR
                        </p>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      <div className="flex justify-center space-x-6">
                        <GoogleLoginComponent />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="w-full">{renderSequentialRegistration()}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
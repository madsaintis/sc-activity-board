import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

export default function VerifyEmail() {
  const { verifyEmail, setVerifyEmail } = useStateContext;
 
  const handleBackToLogin = () => {
    setVerifyEmail(false); // Set verify email to false when "Back to Login" is clicked
  };

  if (!verifyEmail) {
    console.log("FROM VERIFY EMAIL" + verifyEmail);
    return <Navigate to="/login" />;
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <h1 className="title">Verify Your Email</h1>
        <p>Please check your email to verify your account.</p>
        <p>After verifying your email, you can proceed to the login page.</p>
        <Link to="/login" onClick={handleBackToLogin}>Back to Login</Link>
      </div>
    </div>
  );
}

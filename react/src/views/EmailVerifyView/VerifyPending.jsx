import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

export default function VerifyPending() {
  const {setUser, setToken} = useStateContext();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResendEmail = () => {
    setMessage(null);
    setError(null);
    // Logic to resend the email
    axiosClient
      .post("/email/verification-notification")
      .then(() => {
        setMessage("Verification link sent to your email");
      })
      .catch(error => {
        const response = error.response;
        if (response && response.status === 429) {
          setError("Too Many Requests. Please try again later."); 
        }
        else { 
        setError("Failed to resend email verification. Try again later"); }
      }
      );
  };

  const handleBackButton = () => {
    // Logic to resend the email
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      navigate('/login');
    });

  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <h1 className="title">Verify Your Email</h1>
        <p>Please check your email to verify your account.</p>
        <p>
          If you did not receive the verification email, click Resend Email.
        </p>
        <button onClick={handleBackButton}>Back</button>
        <button onClick={handleResendEmail}>Resend Email</button>
        {message || error ? (<div className="alert">
          {message ? <p>{message}</p> : null}
          {error && <p>{error}</p>}
        </div>) : ""}
      </div>
    </div>
  );
}

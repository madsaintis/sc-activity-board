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

  // Handle resend email click
  const handleResendEmail = () => {
    setMessage(null);
    setError(null);
    
    // POST request to resend email
    axiosClient
      .post("/email/verification-notification")
      .then(() => {
        setMessage("Verification link sent to your email");
      })

      // Catch error returned by server
      .catch(error => {
        const response = error.response;
        if (response && response.status === 429) {
          setError("Too many requests made. Please try again later in 1 hour."); 
        }
        else { 
        setError("Failed to resend email verification. Try again later"); }
      }
      );
  };

  return (
    <div className="verify-email animated fadeInDown">
      <div className="form">
      <h1 className="title">Verify Your Email</h1>

        <div className="message">
          Please check your email to verify your account.
        </div>
        <div className="message">
          <p>
            If you did not receive the verification email, click Resend Email.
          </p>
        </div>
        {message || error ? (<div className="alert">
          {message ? <p>{message}</p> : null}
          {error && <p>{error}</p>}
        </div>) : ""}
        <button className='btn btn-block' onClick={handleResendEmail}>Resend Email</button>

      </div>
    </div>
  );
}

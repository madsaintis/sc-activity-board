import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStateContext } from '../../context/ContextProvider';

export default function VerifySuccess() {
  const { user } = useStateContext();
  const navigate = useNavigate();

  // Redirect user to home page after 5 seconds
  useEffect(() => {
    if (user) {
      const redirectTimeout = setTimeout(() => {
        navigate('/home');
      }, 5000);

      return () => clearTimeout(redirectTimeout);
    }
  }, []);

  // Redirect user to home page after clicking OK
  const handleOK = () => {
    navigate('/home');
  }

  return (
    <div className="verify-email animated fadeInDown">
      <div className="form">
        <h1 className="title">Email verified!</h1>
        {!user ? (
          <div className='message'>
            Please log in into your account.
            <Link to="/login">Back to Login</Link>
          </div>
        ) : (
          <div className='message'>
            Click OK or wait a few seconds to proceed.
          </div>
        )}
        <button className='btn btn-block' onClick={handleOK}>OK</button>


      </div>
    </div>

  )
}

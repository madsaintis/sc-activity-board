import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStateContext } from '../../context/ContextProvider';

export default function VerifySuccess() {
    const {user} =
    useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
          const redirectTimeout = setTimeout(() => {
            navigate('/home');
          }, 5000);
    
          return () => clearTimeout(redirectTimeout);
        }
      }, []);

    return (
        
        <div className="login-signup-form animated fadeInDown">
          <div className="form">
            <h1 className="title">Email has been verified!</h1>
            {!user ? (
          <div>
          <p>Please log in into your account.</p>
          <Link to="/login">Back to Login</Link>
        </div>
        ) : (
            <div>
            <p>Please reload the page or click OK.</p>
            <Link to="/home" >OK</Link>
          </div>
        )}
            
          </div>
        </div>
        
      )
}

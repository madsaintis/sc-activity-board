import React, { useState } from 'react'
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

export default function Signup() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user attempt to signup
  const onSubmit = (event) => {
    event.preventDefault();
    setIsDisabled(true);
    setIsLoading(true);
    setErrors(null);

    // Create payload
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }

    // POST request to API '/signup'
    axiosClient.post('/signup', payload)
      // Set user and access token if register process completes
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        setIsDisabled(false);
        setIsLoading(false);
      })
      // Catch error if registration not successful
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setIsDisabled(false);
          setIsLoading(false);
          setErrors(response.data.errors);
        }
      })
  }

  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>

          <h1 className='title'>
            Signup
          </h1>

          <input ref={nameRef} placeholder='Name' />
          <input ref={emailRef} type="email" placeholder='Email' />
          <input ref={passwordRef} type="password" placeholder='Password' />
          <input ref={passwordConfirmationRef} type="password" placeholder='Password Confirmation' />
          <button className='btn btn-block' disabled={isDisabled}>
            {isLoading ? <span>Loading...</span> : 'Signup'}
          </button>

          {errors && <div className='alert'>
            {Object.keys(errors).map(key => (
              <p>{errors[key][0]}</p>
            )
            )}
          </div>
          }

          <p className='message'>
            Already registered? <Link to="/login">Login now</Link>
          </p>
        </form>
      </div>

    </div>
  )
}

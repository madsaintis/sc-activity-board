import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

export default function Login() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken } = useStateContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle when user click login button
  const onSubmit = (event) => {
    event.preventDefault()
    setIsLoading(true);
    setIsDisabled(true);
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setErrors(null);
    axiosClient.post('/login', payload)

      // Set user and access token if login process completes
      .then(({ data }) => {
        setUser(data.user)
        setToken(data.token)
        setIsDisabled(false);
        setIsLoading(false);
      })

      // catch error if login not successful
      .catch(err => {
        const response = err.response;
        setIsLoading(false);
        if (response && response.status === 422) {
          setIsDisabled(false);
          setIsDisabled(false);
          if (response.data.errors) {
            setErrors(response.data.errors);
          }
          else {
            setErrors({
              email: [response.data.message]
            })
          }
        }
      })
  }

  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <h1 className='title'>
            FC ACTIVITY BOARD
          </h1>
          <h1 className='title'>
            Login into your account
          </h1>

          {/* Login form */}
          <input ref={emailRef} type="email" placeholder='Email' />
          <input ref={passwordRef} type="password" placeholder='Password' />
          <button className='btn btn-block' disabled={isDisabled}>
            {isLoading ? <span>Logging...</span> : 'Login'}
          </button>

          {/* Display errors returned by server */}
          {errors && <div className='alert'>
            {Object.keys(errors).map(key => (
              <p>{errors[key][0]}</p>
            )
            )}
          </div>
          }

          {/* Register page link */}
          <p className='message'>
            Not Registered? <Link to="/signup">Create an account</Link>
          </p>

          {/* Reset Password link */}
          <p className='message'>
            Forgot Password? <Link to="/forget-password">Recover password</Link>
          </p>
        </form>
      </div>

    </div>
  )
}

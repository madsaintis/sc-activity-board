import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../axios-client';

export default function Login() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken, verifyEmail} = useStateContext();

  const onSubmit = (event) => {
    event.preventDefault()
    
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setErrors(null)
    axiosClient.post('/login', payload)

      // Set user and access token if register process completes
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      
      // catch error if registration not successful
      .catch(err => {
        const response = err.response;
        if(response && response.status === 422) {
          if(response.data.errors) {
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

  useEffect (() => {
    console.log(verifyEmail)
  }, []);

  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <h1 className='title'>
            Login into your account
          </h1>
          <input ref={emailRef} type="email" placeholder='Email' />
          <input ref={passwordRef} type="password" placeholder='Password' />
          <button className='btn btn-block'>Login</button>
          
          { errors && <div className='alert'>
            {  Object.keys(errors).map(key => (
              <p>{errors[key][0]}</p>
            )
            )}
          </div>
          }
          <p className='message'>
            Not Registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
      
    </div>
  )
}

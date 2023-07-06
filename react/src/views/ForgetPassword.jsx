import React, { useState } from 'react'
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

export default function ForgetPassword() {
    const emailRef = useRef();
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle user attempt to recover password
    const onSubmit = (event) => {
        event.preventDefault();
        setIsDisabled(true);
        setIsLoading(true);
        setErrors(null);
        setMessage(null);

        // Create payload
        const payload = {
            email: emailRef.current.value,
        }

        // POST request to API '/recover-password'
        axiosClient.post('/recover-password', payload)
            .then(({ data }) => {
                setIsDisabled(false);
                setIsLoading(false);
                setMessage("Password recovery link has been sent to your email.")
            })
            // Catch error if registration not successful
            .catch(err => {
                const response = err.response;
                if (response && response.status === 429) {
                    setIsDisabled(false);
                    setIsLoading(false);
                    setErrors('Too many requests. Please try again later.');                }
            })
    }

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className='form'>
                <form onSubmit={onSubmit}>

                    <h1 className='title'>
                        Recover Password
                    </h1>

                    <input ref={emailRef} type="email" placeholder='Enter your email' />

                    <button className='btn btn-block' disabled={isDisabled}>
                        {isLoading ? <span>Loading...</span> : 'Send Recover Email'}
                    </button>

                    {errors && <div className='alert'>
                        {Object.keys(errors).map(key => (
                            <p>{errors[key][0]}</p>
                        )
                        )}
                    </div>
                    }

                    {message && (
                        <div className='info'>
                            <p>{message}</p>
                        </div>
                    )}

                    <p className='message'>
                        Back to login? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>

        </div>
    )
}

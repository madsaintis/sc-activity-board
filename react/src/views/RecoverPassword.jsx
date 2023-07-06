import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useRef } from 'react';

export default function RecoverPassword() {
    const location = useLocation();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const email = new URLSearchParams(location.search).get('email');
    const token = new URLSearchParams(location.search).get('token');

    const onSubmit = (event) => {
        event.preventDefault();
        setIsDisabled(true);
        setIsLoading(true);
        setMessage(null);
        setErrors(null);

        const payload = {
            email: email,
            token: token,
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value,
        };

        axiosClient.post('/reset-password', payload)
            .then(({ data }) => {
                setIsDisabled(false);
                setIsLoading(false);
                setMessage("Password has been reset succesfully.")
            })
            .catch(err => {
                const response = err.response;
                    setIsDisabled(false);
                    setIsLoading(false);
                    setErrors(response.data.errors);
            });
    };

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className='form'>
                <form onSubmit={onSubmit}>
                    <h1 className='title'>Reset Password</h1>

                    <input ref={passwordRef} type='password' placeholder='Password' />
                    <input ref={confirmPasswordRef} type='password' placeholder='Confirm Password' />

                    <button className='btn btn-block' disabled={isDisabled}>
                        {isLoading ? <span>Loading...</span> : 'Reset Password'}
                    </button>

                    {errors && (
                        <div className='alert'>
                            {Object.keys(errors).map(key => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    {message && (
                        <div className='info'>
                            <p>{message}</p>
                        </div>
                    )}

                    <p className='message'>
                        Back to login? <Link to='/login'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

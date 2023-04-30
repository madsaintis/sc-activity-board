import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {

  const onSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>

          <h1 className='title'>
            Signup 
          </h1>

          <input type ="name" placeholder='Name' />
          <input type ="email" placeholder='Email' />
          <input type ="password" placeholder='Password' />
          <input type ="password-confirmation" placeholder='Password Confirmation' />
          <button className='btn btn-block'>Signup</button>

          <p className='message'>
            Already registered? <Link to="/login">Login now</Link>
          </p>
        </form>
      </div>
      
    </div>
  )
}

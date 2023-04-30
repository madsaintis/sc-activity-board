import React from 'react'

const LoginInput = (props) => {
  const { label, onChange, errorMessage, id, ...inputProps } = props;
  return (
    <div className="loginInput">
      <label>{label}</label>
      <input
        {...inputProps} onChange={onChange} required
      />
      <span className='errorMessage'>{errorMessage}</span>
    </div>
  )
}

export default LoginInput
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../context/ContextProvider'

export default function GuestLayout() {

  const {user, token} = useStateContext()
  
  if(token) {

    if(!user.email_verified_at){
    return <Navigate to="/verify-pending" /> }
    
    return <Navigate to="/home" />
  }

  return (
    <div>
        <Outlet />
    </div>
  );
}

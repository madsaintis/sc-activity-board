import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../context/ContextProvider'

export default function GuestLayout() {

  const {user, token} = useStateContext();
  
  // If token exist in local storage, redirect to home page
  if(token) {

    // If not verified yet, show verify email page
    if(user && !user.email_verified_at){
      return <Navigate to="/verify-pending" /> }
    
    // Redirect to home page
    return <Navigate to="/home" />
  }

  return (
    <div>
        <Outlet />
    </div>
  );
}

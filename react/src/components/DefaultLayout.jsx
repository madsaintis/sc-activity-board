import React from 'react'
import { useStateContext } from '../context/ContextProvider'
import { Link, Navigate, Outlet } from 'react-router-dom'

export default function DefaultLayout() {
  const {user,token} = useStateContext()

  if(!token) {
    return <Navigate to="/login" />
  }

  return (
    <div id="defaultLayout">
      <div className='content'>
        <header>
          <Link to="/home">Home</Link>
          <Link to="/favourite">Favourite</Link>
        </header>
      </div>

        <Outlet />
    </div>
  )
}

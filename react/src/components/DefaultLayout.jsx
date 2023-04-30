import React from 'react'
import { useStateContext } from '../context/ContextProvider'
import { Link, Navigate, Outlet } from 'react-router-dom'

export default function DefaultLayout() {
  const {user,token} = useStateContext()

  if(!token) {
    return <Navigate to="/login" />
  }

  const onLogout = (event) => {
    event.preventDefault()
  }

  return (
    <div id="defaultLayout">
      <div className='content'>
        <header>
          <Link to="/home">Home</Link>
          <Link to="/favourite">Favourite</Link>
          <div>
            {user.name}
            <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
          </div>
        </header>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

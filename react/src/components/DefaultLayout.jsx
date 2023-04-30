import React, { useEffect } from 'react'
import { useStateContext } from '../context/ContextProvider'
import { Link, Navigate, Outlet } from 'react-router-dom'
import axiosClient from '../axios-client'

export default function DefaultLayout() {
  const {user, token, setUser} = useStateContext();

  if(!token) {
    return <Navigate to="/login" />
  }

  const onLogout = (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])

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

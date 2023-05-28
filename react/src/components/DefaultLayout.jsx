import React, { useEffect } from 'react'
import { useStateContext } from '../context/ContextProvider'
import { Link, Navigate, Outlet } from 'react-router-dom'
import axiosClient from '../axios-client'

export default function DefaultLayout() {
  const {user, token, setUser, setToken, setID} = useStateContext();

  if(!token) {
    return <Navigate to="/login" />
  }

  const onLogout = (event) => {
    event.preventDefault()

    axiosClient.post('/logout').then(() => {
      setUser({})
      setToken(null)
    })
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
          {
            user.role == 'Admin' && <Link to="/favourite">User</Link>
          }
          
          <div>
            <b>{user.name} ({user.role})</b>
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

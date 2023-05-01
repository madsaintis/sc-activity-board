import React, { useEffect, useState } from 'react'
import axiosClient from '../axios-client';

export default function Favourite() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect( () => {
    getUsers();
  }, [])

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users').then(({data}) => {
      setLoading(false)
      setUsers(data.data)
    })
    .catch(() => {
      setLoading(false)
    })
  }

  return (
    <div>Favourite<div className="card animated fadeInDown">
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
      </thead>
      {loading &&
        <tbody>
        <tr>
          <td colSpan="5" className="text-center">
            Loading...
          </td>
        </tr>
        </tbody>
      }
      {!loading &&
        <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
          </tr>
        ))}
        </tbody>
      }
    </table>
  </div></div>

  )
}

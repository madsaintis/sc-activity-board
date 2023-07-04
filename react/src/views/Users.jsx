import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axiosClient from '../axios-client';
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification, notification } = useStateContext();

  // Retrieve users list upon page load
  useEffect(() => {
    getUsers();
  }, [])

  // Retrieve users list from database
  const getUsers = () => {
    setLoading(true)

    // GET request to API '/users'
    axiosClient.get('/users').then(({ data }) => {
      setLoading(false)
      setUsers(data.data);
    })
      .catch(() => {
        setLoading(false)
      })
  }

  // Handle the delete user button click
  const onDeleteClick = user => {

    // Asks for admin confirmation for user deletion
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }

    // DELETE request to API '/users/ for user.id
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getUsers()
      })
  }

  return (
    <div className="user-page">
      <div className="user-list card animated fadeInDown">

        {/* Display user list */}
        <h1>User List</h1>
        <table>
          <thead>
            <tr>
              <th className='id'>ID</th>
              <th className='email'>Email</th>
              <th className='action'>Actions</th>
            </tr>
          </thead>

          {/* Display loading while browser fetching from database */}
          {loading &&
            <tbody>
              <tr>
                <td>
                  Loading...
                </td>
              </tr>
            </tbody>
          }

          {/* Display user list once data is fetched */}
          {!loading &&
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>
                    <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          }

        </table>
      </div>
    </div>
  )
}

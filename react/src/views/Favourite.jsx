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
      console.log(data.data)
    })
    .catch(() => {
      setLoading(false)
    })
  }

  const handleRoleChange = (userId, event) => {
    const { value } = event.target;
    // Update the user's role in the state or send a request to update it on the server
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: value } : user
      )
    );
  };
  
  return (
    <div>List of users<div className="card animated fadeInDown">
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
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
            <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e)}
                      defaultValue={u.role}
                    >
                      <option value="Event Participant">Event Participant</option>
                      <option value="Event Organizer">Event Organizer</option>
                    </select>
                  </td>
          </tr>
        ))}
        </tbody>
      }
    </table>
  </div></div>
  )
}

import { ArrowBack } from "@mui/icons-material";
import { Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: ""
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();


  // Get user information based on user id
  if (id) {
    useEffect(() => {
      setLoading(true);

      // GET request to API '/users' to get user information
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  // Handle edit button click
  const onSubmit = (ev) => {
    ev.preventDefault();

    // UPDATE request to API '/users' to update
    axiosClient
      .put(`/users/${user.id}`, user)
      .then(() => {
        setNotification("User was successfully updated");
        navigate("/users");
      })

      // Catch errors returned by server
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Navigate user back to previous page when back button clicked
  const goBack = () => {
    navigate("/users");
  }

  return (
    <div className="user-form">

      {/* Edit user form header */}
      <div className="user-form-header">
        <IconButton className="icon-button" onClick={goBack}>
          <ArrowBack />
        </IconButton>
        {user.id && <h1>Update User: {user.name}</h1>}
      </div>

      <div className="card animated fadeInDown">

        {/* Show loading icon when fetching user data */}
        {loading && <div className="text-center">Loading...</div>}

        {/* Show edit user form after data is fetched */}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={(ev) => setUser({ ...user, name: ev.target.value })}
              placeholder="Name"
            />
            <input
              value={user.email}
              disabled
              placeholder="Email"
            />
            <input
              type="password"
              onChange={(ev) => setUser({ ...user, password: ev.target.value })}
              placeholder="Password"
            />
            <input
              type="password"
              onChange={(ev) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
              placeholder="Password Confirmation"
            />
            <div className="role-checkbox" >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.role === 'Event Organiser'}
                    onChange={(ev) =>
                      setUser({ ...user, role: ev.target.checked ? 'Event Organiser' : 'Event Participant' })}
                  />
                }
                label="User is an event organiser"
              />
            </div>

            {/* Display error messages */}
            {errors && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}

            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </div>

  );
}

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { ArrowBack, CheckBox } from "@mui/icons-material";

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

  if (id) {
    useEffect(() => {
      setLoading(true);
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

  const onSubmit = (ev) => {
    ev.preventDefault();
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          setNotification("User was successfully updated");
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } ;


  const goBack = () => {
    navigate("/users");
  }

  return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh'}}>
<div >
  <div style={{ display: 'flex', alignItems: 'center' }}>
  <IconButton onClick={goBack} style={{ marginRight: '10px' }}>
        <ArrowBack />
      </IconButton>
    {user.id && <h1 style={{ marginLeft: '10px' }}>Update User: {user.name}</h1>}
    
  </div>
</div>

<div className="card animated fadeInDown" style={{margin: '10px'}}>
  {loading && <div className="text-center">Loading...</div>}
  {errors && (
    <div className="alert">
      {Object.keys(errors).map((key) => (
        <p key={key}>{errors[key][0]}</p>
      ))}
    </div>
  )}
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={user.role === 'Event Organiser'}
                onChange={(ev) =>
                  setUser({ ...user, role: ev.target.checked ? 'Event Organiser' : 'Event Participant' })}
              />
            }
            label="User is an event organiser"
            style={{ marginLeft: '15px' }}
          />
        </div>
      <button className="btn">Save</button>
    </form>
  )}
</div>
</div>

  );
}

import React, { useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, setID, notification, getTags, getEvents } =
    useStateContext();

    if (!token) {
      return <Navigate to="/login" />;
    }
 
  const onLogout = (event) => {
    event.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    
      if(!user.email_verified_at) {
        return <Navigate to="/verify-pending" />
      }
    });

    getTags();
  }, []);


  return (
    <div id="defaultLayout">
      <div className="content">
        <header>
          <Link to="/home">Home</Link>
          <Link to="/favourite">Favourite</Link>
          {user.role == "Admin" && <Link to="/Users">User</Link>}

          <div>
            <b>
              {user.name} ({user.role})
            </b>
            <a href="#" onClick={onLogout} className="btn-logout">
              Logout
            </a>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}

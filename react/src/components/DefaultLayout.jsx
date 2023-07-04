import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import Header from "./ApplicationBar";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification, getTags, getEvents, setEvents } =
    useStateContext();

  // If token does not exist in local storage, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // On page load, get user information,
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);

      // On page load, get user information,
      if (!user.email_verified_at) {
        return <Navigate to="/verify-pending" />
      }
    });

    // Get list of tags from database
    getTags();

    // Get list of events from database
    getEvents();
  }, []);


  return (
    <div id="defaultLayout">
      <div className="content">
        <Header />
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}

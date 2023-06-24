import React, { useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios-client";

export default function VerifyLayout() {
  const { user, token, setUser, setToken, setID, notification, getTags } =
    useStateContext();

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
    });
    
  }, []);

  return (
    <div id="defaultLayout">
        <header>
          <b>
            SC ACTIVITY BOARD
        </b>

          <div>
            <a href="#" onClick={onLogout} className="btn-logout">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
    </div>
  );
}

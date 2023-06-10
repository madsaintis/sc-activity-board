import React, { useEffect} from 'react'
import axiosClient from '../axios-client';
import {Link, useNavigate} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function Favourite() {

  const {
    favouriteEventsData
  } = useStateContext();

  useEffect (() => {
    console.log(favouriteEventsData);
  }, []);

  return (
    <div>
      <h1>Favourite Events</h1>
      {favouriteEventsData.map((event) => (
        <div key={event.id} className="event-card">
          <h2>{event.title}</h2>
          <p>Start Time: {event.start_time}</p>
        </div>
      ))}
    </div>
  );
}

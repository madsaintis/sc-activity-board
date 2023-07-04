
import React, { useEffect, useState } from 'react';
import Calendar from '../components/Calendar/Calendar';
import { useStateContext } from '../context/ContextProvider';
import EventCreationModal from '../components/Calendar/EventCreationModal';
import EventSearch from '../components/Calendar/EventSearch';

export default function Home() {
  const { user, eventsDatam, token, getEvents, setEvents } = useStateContext();

  return (
    <div className='homePage'>

      {/* Home page header*/}
      <div className='welcome'>
        <h2>Welcome, {user.name}</h2>
      </div>
            <EventSearch />

      {/* Calendar component */}
      <div id='Calendar' className="calendarContainer">
        <Calendar />
      </div>
    </div>
  );

}

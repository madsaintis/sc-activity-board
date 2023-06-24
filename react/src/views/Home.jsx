
import React, { useEffect, useState } from 'react';
import Calendar from '../components/Calendar/Calendar';
import { useStateContext } from '../context/ContextProvider';
import EventCreationModal from '../components/Calendar/EventCreationModal';
import EventSearch from '../components/Calendar/EventSearch';

export default function Home() {
  const { showEventModal, eventsDatam, token, getEvents, setEvents } = useStateContext();

  // useEffect (()=> {
  //   getEvents();
  // }, []);

  return (
    <div className='homePage'>
      <div id='Calendar' className="calendarContainer">
        {/* <Sidebar/> */}
        <Calendar />
      </div>
      {showEventModal && (
        <div className="eventModalWrapper">
          <EventCreationModal />
        </div>
      )}
      <EventSearch />
    </div>
  );

}

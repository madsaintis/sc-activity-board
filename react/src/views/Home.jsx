
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Calendar/Sidebar';
import Calendar from '../components/Calendar/Calendar';
import { useStateContext } from '../context/ContextProvider';
import EventModal from '../components/Calendar/EventModal';

export default function Home() {
  const { showEventModal, eventsData } = useStateContext();
  
  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      <div id='Calendar'>
        <Sidebar/>
        <Calendar/>
      </div>
    </React.Fragment>
  );
}

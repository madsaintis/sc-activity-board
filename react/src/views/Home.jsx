import React from 'react'
import Sidebar from '../components/Calendar/Sidebar.jsx'
import Calendar from '../components/Calendar/Calendar.jsx'
import { useStateContext } from '../context/ContextProvider';
import EventModal from '../components/Calendar/EventModal.jsx';

export default function Home() {
  const {showEventModal} = useStateContext();
  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      <div id='Calendar'>
        <Sidebar />
        <Calendar />
      </div>
    </React.Fragment>
  )


}

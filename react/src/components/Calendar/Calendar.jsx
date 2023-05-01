import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';

export default function Calendar() {
  const {setShowEventModal, setSelectedEvent} = useStateContext();

  const handleEvent = (args) => {
    setSelectedEvent(args)
    console.log(args.event.title)
    setShowEventModal(true)
  }
  return (
    <div className='Test'>
        <FullCalendar 
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView='dayGridMonth'
    events={[
      { title: 'event 1', date: '2023-05-01', 
      extendedProps: {
        desc: "HAHA"
      } },
      { title: 'event 2', date: '2019-04-02', desc:"HAHA" }
    ]}
        dateClick={() => setShowEventModal(true)}
        fixedWeekCount= {false}
        eventClick={handleEvent}
        />
    </div>
  )
}

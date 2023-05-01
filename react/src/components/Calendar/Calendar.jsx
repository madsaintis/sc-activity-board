import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';

export default function Calendar() {
  const {setShowEventModal} = useStateContext();
    // const handleDateClick = (arg) => { // bind with an arrow function
    //     alert(arg.dateStr)
    //   }

  return (
    <div className='Test'>
        <FullCalendar 
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView='dayGridMonth'
    events={[
      { title: 'event 1', date: '2023-05-01' },
      { title: 'event 2', date: '2019-04-02' }
    ]}
        dateClick={() => setShowEventModal(true)}
        fixedWeekCount= {false}/>
    </div>
  )
}

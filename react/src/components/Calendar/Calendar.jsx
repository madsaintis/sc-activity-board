import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';

export default function Calendar() {
  const {setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents} = useStateContext();
  
  useEffect( () => {
    getEvents()
  }, [])

  const handleEvent = (args) => {
    setSelectedEvent(args)
    setShowEventModal(true)
  }

  return (
    <div className='Test'>
        <FullCalendar 
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView='dayGridMonth'
    events={
      eventsData.map(event => {
        return {
          id: event.id,
          title: event.title,
          start: event.date,
          extendedProps: {
            location: event.location,
            description: event.description,
            startTime: event.start_time,
            endTime: event.end_time,
            organiser: event.organiser,
            categories: event.categories
          }
        }
      })
  }
        dateClick={function(args){
          setSelectedDate(args.date);
          setShowEventModal(true);
         }}
        fixedWeekCount= {false}
        eventClick={handleEvent}
        displayEventTime={false}
        
        />
    </div>
  )
}

// { title: 'event 1', date: '2023-05-01', 
//       extendedProps: {
//         desc: "HAHA"
//       } },
//       { title: 'event 2', date: '2019-04-02', desc:"HAHA" }
import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';

export default function Calendar() {
  const { setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getPublicEvents, setEvents } = useStateContext();

  useEffect(() => {
    getPublicEvents();
  }, []);

  const handleEvent = (args) => {
    setSelectedEvent(args);
    setShowEventModal(true);
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
                categories: event.categories,
                isPublic: event.isPublic,
              }
            }
          })
        }
        dateClick={function(args) {
          setSelectedDate(args.date);
          setShowEventModal(true);
        }}
        fixedWeekCount={false}
        eventClick={handleEvent}
        displayEventTime={false}
      />
    </div>
  )
}



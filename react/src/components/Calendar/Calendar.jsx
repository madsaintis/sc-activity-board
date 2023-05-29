import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';

export default function Calendar() {
  const { setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents, setEvents } = useStateContext();

  useEffect(() => {
    getEvents();
  }, []);

  const handleEvent = (args) => {
    setSelectedEvent(args);
    setShowEventModal(true);
  }

  const filterEventsData = () => {
    console.log('Original eventsData:s', eventsData);
  
    const filteredData = eventsData.filter(event => {
      const categoryIds = event.categories.map(category => category.category_id);
      return categoryIds.includes(1);
    });
  
    console.log('Filtered eventsData:', filteredData);
    setEvents(filteredData);
  };

  return (
    <div className='Test'>
      <button onClick={filterEventsData}> HAI</button>
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



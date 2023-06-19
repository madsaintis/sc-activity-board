import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';

export default function Calendar() {

  const { setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents, getTags, getPrivateEvents} = useStateContext();
  const [contentHeight, setContentHeight] = useState(
    window.innerWidth < 577 ? 9000 : 1000
  );

  const handleEvent = (args) => {
    setSelectedDate(args.event.start.toISOString())
    setSelectedEvent(args);
    setShowEventModal(true);
  }

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

// Custom class name for past dates
const getDayClassNames = (arg) => {
  if (isPastDate(arg.date)) {
    return 'past-date';
  }
  return '';
};

function determineDayCellClassNames(date) {
  // Custom logic to determine the CSS class names
  let classNames = [];
  
  // Add class names based on your logic
  if (date.date  === 0 || date.date === 6) {
    classNames.push('weekend');
  }

  if (date.date  === 11 && date.date  === 25) {
    classNames.push('christmas');
  }

  return classNames;
}

 return (
    <div className='calendar-container'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        
        events={eventsData.map(event => ({
          id: event.id,
          title: event.title,
          start: event.date,
          extendedProps: {
            location: event.location,
            description: event.description,
            startTime: event.start_time,
            endTime: event.end_time,
            organiser: BigInt(event.organiser),
            categories: event.categories,
            isPublic: event.isPublic,
            image: event.poster,
            isFavourite: event.isFavourite
          }
        }))}
        dateClick={(args) => {
          if (!isPastDate(args.date)) {
            setSelectedDate(args.date);
            setShowEventModal(true);
          }
        }}
        fixedWeekCount={false}
        eventClick={handleEvent}
        displayEventTime={false}
        contentHeight={contentHeight}
        dayCellClassNames={determineDayCellClassNames}
      />
    </div>
  );
}



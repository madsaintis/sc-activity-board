import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';
import { Box, Modal, Typography } from '@mui/material';
import EventModal from './EventModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Calendar() {

  const { setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents, getTags, getPrivateEvents, setOpenModal, openModal} = useStateContext();
  const [contentHeight, setContentHeight] = useState(
    window.innerWidth < 577 ? 600 : 1000
  );

  const handleEvent = (args) => {
    setSelectedDate(args.event.start.toISOString())
    setSelectedEvent(args);
    setOpenModal(true);
  }

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

function determineDayCellClassNames(date) {
  // Custom logic to determine the CSS class names
  let classNames = [];
  
  // Add class names based on your logic
  if (date.isPast) {
    classNames.push('past');
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
            organiser: event.organiser,
            categories: event.categories,
            isPublic: event.isPublic,
            image: event.poster,
            isFavourite: event.isFavourite
          }
        }))}
        dateClick={(args) => {
          if (!isPastDate(args.date)) {
            setSelectedDate(args.date);
            setOpenModal(true);
          }
        }}
        fixedWeekCount={false}
        eventClick={handleEvent}
        displayEventTime={false}
        contentHeight={contentHeight}
        dayCellClassNames={determineDayCellClassNames}
      />

  {openModal && <EventModal />}
  
    </div>
  );
}



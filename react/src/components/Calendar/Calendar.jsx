import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import { useStateContext } from '../../context/ContextProvider';
import { Box, Modal, Typography, useTheme } from '@mui/material';
import EventCreationModal from './EventCreationModal';
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import EventModal from './EventModal';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Calendar() {

  const { user, setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents, getTags, getPrivateEvents, setOpenCreationModal, openCreationModal, setOpenModal, openModal,theme} = useStateContext();
  const [contentHeight, setContentHeight] = useState(
    window.innerWidth < 577 ? 800 : 1000
  );
  
  
  const handleEvent = (args) => {
    setSelectedDate(args.event.start)
    setSelectedEvent(args);

    if(args.event.extendedProps.organiser == user.name) {
      setOpenCreationModal(true);
    }

    else {
      setOpenModal(true);
    }
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
        
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        initialView='dayGridMonth'
        handleWindowResize
        events={eventsData.map(event => {
  
          return {
            id: event.id,
            title: event.title,
            start: event.start_time,
            end: event.end_time,
            backgroundColor: event.categories[0].tag_colour,
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
          };
        })}
        dateClick={(args) => {
          if (!isPastDate(args.date)) {
            setSelectedDate(args.date);
            setOpenCreationModal(true);
          }
        }}

        fixedWeekCount={false}
        eventClick={handleEvent}
        contentHeight={contentHeight}
        displayEventTime={true}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,listWeek' // user can switch between the two
        }}
        dayCellClassNames={determineDayCellClassNames}
        eventDisplay='block'
        // eventTimeFormat={{
        //   hour: '2-digit',
        //   minute: '2-digit',
        //   meridiem: true,
        // }}
        eventContent={(eventInfo) => (
          <div style={{ fontSize: '14px', padding: '0px 2px' }}>{eventInfo.event.title}</div>
        )}
        views={{
          timeGridWeek: {
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit'
            }
          }
        }}
        
      />

  {openCreationModal && <EventCreationModal />}
  
  {openModal && <EventModal />}
  
    </div>
  );
}



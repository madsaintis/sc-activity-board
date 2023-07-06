import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'; // Import Draggable from interactionPlugin
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../context/ContextProvider';
import EventCreationModal from './EventCreationModal';
import EventModal from './EventModal';

export default function Calendar() {
  const { user, setSelectedEvent, setSelectedDate, eventsData, setOpenCreationModal, openCreationModal, setOpenModal, openModal } = useStateContext();

  // Adjust calendar height based on user screen
  const [contentHeight, setContentHeight] = useState(window.innerWidth < 577 ? 600 : 700);

  // Handle when user click on an event
  const handleEventClick = (args) => {
    setSelectedDate(args.event.start);
    setSelectedEvent(args);

    // If user is the organiser or admin, shows event edit/creation modal
    if (args.event.extendedProps.isOrganiser) {
      setOpenCreationModal(true);
    }
    // Else display event view modal
    else {
      setOpenModal(true);
    }
  };

  // Handle when user click on a date
  const handleDateClick = (args) => {
    // If chosen date already past, do not allow user to create new event
    if (!isPastDate(args.date)) {
      setSelectedDate(args.date);
      setOpenCreationModal(true);
    }
  };

  // Group past date in calendar
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Determine class names for day cells
  function determineDayCellClassNames(date) {
    let classNames = [];

    // Add class names based on your logic
    if (date.isPast) {
      classNames.push('past');
    }

    return classNames;
  }

  // Display event using FullCalendar library
  return (
    <div className='calendar-container'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        initialView='dayGridMonth'
        fixedWeekCount={false}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        contentHeight={contentHeight}
        displayEventTime={true}
        dayCellClassNames={determineDayCellClassNames}
        eventDisplay='block'
        editable={true} // Enable event dragging
        events={eventsData.map((event) => {
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
              isFavourite: event.isFavourite,
              isOrganiser: event.isOrganiser,
            },
          };
        })}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,listMonth', // Switches user between calendar and list layout
        }}
        eventContent={(eventInfo) => <div style={{ fontSize: '14px', padding: '0px 2px' }}>{eventInfo.event.title}</div>}
        views={{
          dayGrid: {
            dayMaxEvents: 3,
          },
          timeGridWeek: {
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
            },
          },
        }}
      />

      {/* Display modal on top of home page*/}
      {openCreationModal && <EventCreationModal />}
      {openModal && <EventModal />}
    </div>
  );
}

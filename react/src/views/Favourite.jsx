import React, { useEffect } from 'react';
import axiosClient from '../axios-client';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import { Card, CardContent, Typography } from '@mui/material';
import EventModal from '../components/Calendar/EventModal';
import EventCreationModal from '../components/Calendar/EventCreationModal';
import RenderGroup from '../components/Calendar/RenderGroup';

export default function Favourite() {
  const { user, setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents, getTags, getPrivateEvents, setOpenCreationModal, openCreationModal, setOpenModal, openModal,theme, favouriteEventsData} = useStateContext();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };

  console.log(favouriteEventsData)
  // Sort events by date
  const sortedEvents = [...favouriteEventsData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  function formatTime(timeString) {
    const date = new Date(`2000-01-01 ${timeString}`); // Use a dummy date to parse the time
    return (date.toLocaleTimeString([], { timeStyle: 'short' })).toUpperCase(); // Format as 12-hour time
  }

  const handleEvent = (args) => {

    setSelectedDate(new Date(args.start_time))
    setSelectedEvent({
      event: {
        id: args.id,
        title: args.title,
        extendedProps: {
          location: args.location,
          description: args.description,
          startTime: args.start_time,
          endTime: args.end_time,
          organiser: args.organiser,
          categories: args.categories,
          isPublic: args.isPublic,
          image: args.poster,
          isFavourite: args.isFavourite,
        },
      },
    });

    if(args.organiser == user.name) {
    setOpenCreationModal(true);
    }
    

     else {
       setOpenModal(true);
     }
   }



  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 16px', padding: '20px' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1>Favourite Events</h1> <RenderGroup />
        {sortedEvents.map((event, index) => {
          const currentDate = formatDate(event.date);
          let previousDate = null;

          if (index > 0) {
            previousDate = formatDate(sortedEvents[index - 1].date);
          }

          return (
            <div key={event.id}>
              {index === 0 || currentDate !== previousDate ? (
                <Typography variant="h5" component="div">
                  {currentDate}
                </Typography>
              ) : null}
              <Link
                to="#"
                style={{ textDecoration: 'none' }}
                onClick={() => handleEvent(event)}
              >
                <Card className="event-card">
                  <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {event.poster && (
                        <div style={{ marginRight: '16px' }}>
                          <img
                            src={`data:image/jpeg;base64,${event.poster}`}
                            alt="Event Poster"
                            style={{ width: '100px' }}
                          />
                        </div>
                      )}
                      <div>
                        <Typography variant="h5" component="div" fontWeight={'bold'}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="blue">
                          Start Time: {new Date(event.start_time).toLocaleTimeString(undefined, options)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.organiser_id}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
          
        })}
      </div>

      {openCreationModal && <EventCreationModal />}
      {openModal && <EventModal />}
    </div>
  );
}

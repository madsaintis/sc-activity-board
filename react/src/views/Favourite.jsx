import React, { useEffect } from 'react';
import axiosClient from '../axios-client';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import { Card, CardContent, Typography } from '@mui/material';
import EventModal from '../components/Calendar/EventModal';
import EventCreationModal from '../components/Calendar/EventCreationModal';
import EventSearch from '../components/Calendar/EventSearch';
import EventSearchFavourite from '../components/Calendar/EventSearchFavourite';
import { Sell } from '@mui/icons-material';

export default function Favourite() {
  const { user, setShowEventModal, setSelectedEvent, setSelectedDate, eventsData, getEvents, getTags, getPrivateEvents, setOpenCreationModal, openCreationModal, setOpenModal, openModal,theme, favouriteEventsData} = useStateContext();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };

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
    
    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 16px', padding: '10px' }}>
      
      <div style={{ maxWidth: '800px', width: '100%' }}>
      <EventSearchFavourite />
        <h1>My Events</h1> 
        {sortedEvents.map((event, index) => {
          const currentDate = formatDate(event.date);
          let previousDate = null;

          if (index > 0) {
            previousDate = formatDate(sortedEvents[index - 1].date);
          }

          return (
            <div key={event.id} style={{ marginBottom: '20px' }}>
              {index === 0 || currentDate !== previousDate ? (
                <Typography variant="h5" component="div" style={{ marginBottom: '10px' }}>
                  {currentDate}
                </Typography>
              ) : null}
              <Link
                to="#"
                style={{ textDecoration: 'none', display: 'block' }}
                onClick={() => handleEvent(event)}
              >
                <Card className="event-card" style={{ marginBottom: '10px' }}>
                  <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    {event.poster ? (
  <div style={{ marginRight: '16px' }}>
    <img
      src={`data:image/jpeg;base64,${event.poster}`}
      alt="Event Poster"
      style={{ width: '100px' }}
    />
  </div>
) : (
  <div style={{ marginRight: '16px' }}>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      alt="No Event Poster"
      style={{ width: '100px' }}
    />
  </div>
)}

                      <div>
                        <Typography variant="h5" component="div" fontWeight={'bold'}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="blue">
                          {new Date(event.start_time).toLocaleTimeString(undefined, options)} - {new Date(event.end_time).toLocaleTimeString(undefined, options)}
                        </Typography>
                        <Typography variant="body2" color="black">
                          Location: {event.location}
                        </Typography>
                        <Typography variant="h8" color="black">
                          by: {event.organiser}
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

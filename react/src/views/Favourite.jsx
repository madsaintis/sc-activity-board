import React, { useEffect } from 'react';
import axiosClient from '../axios-client';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import { Card, CardContent, Typography } from '@mui/material';

export default function Favourite() {
  const { favouriteEventsData } = useStateContext();

  useEffect(() => {
    console.log(favouriteEventsData);
  }, []);

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
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 16px' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1>Favourite Events</h1>
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
                      <Typography variant="h5" component="div">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start Time: {event.start_time}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function Sidebar({ events, setFilteredEvents }) {
  const [titleFilter, setTitleFilter] = useState('');

  const handleTitleFilterChange = (e) => {
    setTitleFilter(e.target.value);
    filterEventsByTitle(e.target.value);
  };

  const filterEventsByTitle = (title) => {
    const filteredEvents = events.filter((event) => {
      return event.title.toLowerCase().includes(title.toLowerCase());
    });
    setFilteredEvents(filteredEvents);
  };

  return (
    <div className="Sidebar">
      <h2>Filter events</h2>

    </div>
  );
};

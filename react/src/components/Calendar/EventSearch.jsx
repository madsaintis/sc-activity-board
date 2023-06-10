import React, { useState } from 'react';
import { useStateContext } from "../../context/ContextProvider";

const EventSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const {
    eventsData,
    setEvents,
    initialEventsData,
    tags
  } = useStateContext();

  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    // Filter events based on search term and tags
    const filteredEvents = initialEventsData.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tags.some(tag => tag.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Extract up to 3 title suggestions that start with the search term
    const titleSuggestions = filteredEvents
      .filter(event => event.title.toLowerCase().startsWith(searchTerm.toLowerCase()))
      .map(event => event.title)
      .slice(0, 3);

    // Extract up to 3 tag suggestions that start with the search term
    const tagSuggestions = tags
      .filter(tag => tag.category_name.toLowerCase().startsWith(searchTerm.toLowerCase()))
      .map(tag => tag.category_name)
      .slice(0, 3);

    const eventSuggestions = titleSuggestions.concat(tagSuggestions);

    setSuggestions(eventSuggestions);
  };

  const handleSelectSuggestion = (filter) => {
    if (!selectedFilters.includes(filter)) {
      const updatedFilters = [...selectedFilters, filter];
      setSelectedFilters(updatedFilters);
      setSearchTerm('');
      setSuggestions([]);
  
      // Filter events based on selected filters using OR logic
      const filteredEvents = initialEventsData.filter((event) =>
        updatedFilters.some(filter =>
          event.title.toLowerCase().includes(filter.toLowerCase()) ||
          event.categories.some(category =>
            category.category_name.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
  
      setEvents(filteredEvents); // Call setEvents() with the filtered events
    }
  };

  const handleRemoveFilter = (filter) => {
    const updatedFilters = selectedFilters.filter((f) => f !== filter);
    setSelectedFilters(updatedFilters);
  
    // Filter events based on remaining filters, or set initial events if no filters are selected
    const filteredEvents = updatedFilters.length > 0
      ? initialEventsData.filter((event) =>
          updatedFilters.some(filter =>
            event.title.toLowerCase().includes(filter.toLowerCase()) ||
            event.categories.some(category =>
              category.category_name.toLowerCase().includes(filter.toLowerCase())
            )
          )
        )
      : initialEventsData;
  
    setEvents(filteredEvents); // Call setEvents() with the filtered events or initial events
  };


  return (
    <div>
      <div>
        {selectedFilters.map((filter) => (
          <span key={filter}>
            {filter}
            <button onClick={() => handleRemoveFilter(filter)}>X</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search events..."
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li
            key={suggestion}
            onClick={() => handleSelectSuggestion(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventSearch;

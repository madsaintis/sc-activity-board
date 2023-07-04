import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useStateContext } from '../../context/ContextProvider';

export default function EventSearchFavourite() {

  const { tags, favouriteEventsData, setEvents, setFavouritedEvents, initialFavouritedEventsData } = useStateContext();

  // The dropdown options
  const options = [
      ...tags.map((tag) => ({ tag_name: tag.tag_name, isTag: true })),
      ...favouriteEventsData.map((event) => ({
        title: event.title,
        isTag: false,
      })),
    ];

  // Handles the dropdown changes and filter events
  const handleOptionChange = (event, selectedOptions) => {
    
    // If filter field is empty, reset the events shown in the 
    // calendar to the initial view
    if (selectedOptions.length === 0) {
        setFavouritedEvents(initialFavouritedEventsData);
      return;
    }
    
    // Filter events based on:
    const filteredEvents = initialFavouritedEventsData.filter((event) => {
        
        // Based on titles
        const matchesTitle = selectedOptions.some(
          (option) => option.isTag === false && option.title === event.title
        );

        // Based on event tags
        const matchesCategory = selectedOptions.some(
          (option) =>
            option.isTag === true &&
            event.categories.some(
              (category) => category.tag_name.toLowerCase() === option.tag_name.toLowerCase()
            )
        );

        return matchesTitle || matchesCategory;
      });
    
      // Update the event list
      setFavouritedEvents(filteredEvents);
    };

   // Check if default value is same as dropdown options
  const isOptionEqualToValue = (option, value) => {
    if (option.isTag !== value.isTag) {
      return false;
    }
    if (option.isTag) {
      return option.tag_name === value.tag_name;
    } else {
      return option.title === value.title;
    }
  };

  return (
    <Autocomplete
    sx={{padding: 1}}
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={options}
      getOptionLabel={(option) => {
        if (option.isTag) {
          return `tag: ${option.tag_name}`;
        } else if(option.isOrganiser) {
            return 'type: My Event';
        }
        
        else {
          return `title: ${option.title}`;
        }
      }}
      onChange={handleOptionChange}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => <TextField {...params} label="Event Filter"/>}
      
    />
  );
}
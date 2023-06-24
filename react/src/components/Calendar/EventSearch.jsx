// import React, { useState, useEffect, useRef } from 'react';
// import { useStateContext } from "../../context/ContextProvider";
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';

// const EventSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedValue, setSelectedValue] = useState(null); // New state variable for selected value
//   const [selectedFilters, setSelectedFilters] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const inputRef = useRef(null);

//   const {
//     setEvents,
//     initialEventsData,
//     tags,
//   } = useStateContext();

//  useEffect(() => {
//      setSelectedValue(''); // Reset selected value when suggestions change
//  }, [suggestions]);

//  const handleInputChange = (event, value) => {
//     setSearchTerm(value);
  
//     if (value.length > 0) {
//       // Filter events based on search term and tags
//       const filteredEvents = initialEventsData.filter((event) =>
//         event.title.toLowerCase().includes(value.toLowerCase()) ||
//         tags.some(tag => tag.tag_name.toLowerCase().includes(value.toLowerCase()))
//       );
  
//       // Extract up to 3 title suggestions that start with the search term
//       const titleSuggestions = filteredEvents
//         .filter(event => event.title.toLowerCase().startsWith(value.toLowerCase()))
//         .map(event => ({ type: 'title', value: event.title, label: `title: ${event.title}`  }))
//         .slice(0, 3);
  
//       // Extract up to 3 tag suggestions that start with the search term
//       const tagSuggestions = tags
//         .filter(tag => tag.tag_name.toLowerCase().startsWith(value.toLowerCase()))
//         .map(tag => ({ type: 'tags', value: tag.tag_name , label: `tags: ${tag.tag_name}`}))
//         .slice(0, 3);
  
//       const eventSuggestions = titleSuggestions.concat(tagSuggestions);
  
//       setSuggestions(eventSuggestions);
//     } else {
//       setSuggestions([]); // Clear suggestions when no characters are inserted
//     }
//   };
  

//   const handleSelectSuggestion = (filter) => {
//     const selectedFilter = filter.value;
//     console.log(selectedFilter)
//     if (!selectedFilters.some((f) => f.value === selectedFilter)) {
//       const updatedFilters = [...selectedFilters, filter];
//       setSelectedFilters(updatedFilters);
//       inputRef.current.blur();
//       setSearchTerm('');
//       setSuggestions([]);
//       setSelectedValue(filter.value); // Set the selected value
  
//       // Filter events based on selected filters using OR logic
//       const filteredEvents = initialEventsData.filter((event) =>
//         updatedFilters.some((filter) =>
//           event.title.toLowerCase().includes(filter.value.toLowerCase()) ||
//           event.categories.some((category) =>
//             category.tag_name.toLowerCase().includes(filter.value.toLowerCase())
//           )
//         )
//       );
  
//       setEvents(filteredEvents); // Call setEvents() with the filtered events
//     }
//   };
  
//   const handleRemoveFilter = (filter) => {
//     const updatedFilters = selectedFilters.filter((f) => f.value !== filter.value);
//     setSelectedFilters(updatedFilters);
  
//     // Filter events based on remaining filters, or set initial events if no filters are selected
//     const filteredEvents = updatedFilters.length > 0
//       ? initialEventsData.filter((event) =>
//           updatedFilters.some((filter) =>
//             event.title.toLowerCase().includes(filter.value.toLowerCase()) ||
//             event.categories.some((category) =>
//               category.tag_name.toLowerCase().includes(filter.value.toLowerCase())
//             )
//           )
//         )
//       : initialEventsData;
  
//     setEvents(filteredEvents); // Call setEvents() with the filtered events or initial events
//   };
  
  
//   return (
//     <div>
//       <Autocomplete
//         freeSolo
//         value={selectedValue} // Use selectedValue instead of searchTerm
//         onChange={(event, newValue) => {
//           setSelectedValue(newValue);
//         }}
//         onInputChange={handleInputChange}
//         options={suggestions}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Search events..."
//             inputRef={inputRef}
//           />
//         )}
//         getOptionLabel={(option) => {
//   if (typeof option === 'string') {
//     return option;
//   }
//   return option.label;
// }}
// renderOption={(props, option) => (
//   <li {...props} onClick={() => handleSelectSuggestion(option)}>
//     {option.type === 'title' ? (
//       <span>
//         <span className="bold">title:</span> {option.label.substring(7)}
//       </span>
//     ) : option.type === 'tags' ? (
//       <span>
//         <span className="bold">tags:</span> {option.label.substring(6)}
//       </span>
//     ) : (
//       option.label
//     )}
//   </li>
// )}

//       />

//       <div>
//   {selectedFilters.map((filter) => (
//     <span key={filter.value} className="filter">
//       {filter.type === 'title' ? (
//         <span>
//           <span className="bold">title:</span> {filter.label.substring(7)}
//         </span>
//       ) : filter.type === 'tags' ? (
//         <span>
//           <span className="bold">tags:</span> {filter.label.substring(6)}
//         </span>
//       ) : (
//         filter.label
//       )}
//       <button onClick={() => handleRemoveFilter(filter)}>X</button>
//     </span>
//   ))}
// </div>

//     </div>
//   );
// };

// export default EventSearch;

import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useStateContext } from '../../context/ContextProvider';

export default function EventSearch() {

  const { tags, initialEventsData, setEvents } = useStateContext();

  const options = [
    ...tags.map((tag) => ({ tag_name: tag.tag_name, isTag: true })),
    ...initialEventsData.map((event) => ({ title: event.title, isTag: false })),
  ];

  const handleOptionChange = (event, selectedOptions) => {

    if (selectedOptions.length === 0) {
      setEvents(initialEventsData);
      return;
    }
    
    const filteredEvents = initialEventsData.filter((event) => {
      const matchesTitle = selectedOptions.some(
        (option) => option.isTag === false && option.title === event.title
      );
      const matchesCategory = selectedOptions.some(
        (option) =>
          option.isTag === true &&
          event.categories.some((category) => category.tag_name.toLowerCase() === option.tag_name.toLowerCase())
      );
      return matchesTitle || matchesCategory;
    });

    setEvents(filteredEvents);
  };

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
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={options}
      getOptionLabel={(option) => {
        if (option.isTag) {
          return `tag: ${option.tag_name}`;
        } else {
          return `title: ${option.title}`;
        }
      }}
      onChange={handleOptionChange}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => <TextField {...params} label="limitTags" placeholder="Favorites" />}
      
    />
  );
}


// import React, { useState } from 'react';

// export default function Sidebar({ events, setFilteredEvents }) {
//   const [titleFilter, setTitleFilter] = useState('');

//   const handleTitleFilterChange = (e) => {
//     setTitleFilter(e.target.value);
//     filterEventsByTitle(e.target.value);
//   };

//   const filterEventsByTitle = (title) => {
//     const filteredEvents = events.filter((event) => {
//       return event.title.toLowerCase().includes(title.toLowerCase());
//     });
//     setFilteredEvents(filteredEvents);
//   };

//   return (
//     <div className="Sidebar">
//       <h2>Filter events</h2>

//     </div>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import { useStateContext } from '../../context/ContextProvider';

// export default function Sidebar() {
//   const {eventsData, setEvents, initialEventsData} = useStateContext();
//   const [allChecked, setAllChecked] = useState(false);
//   const [checkboxes, setCheckboxes] = useState({
//     option1: false,
//     option2: false,
//     option3: false
//   });

//   const handleAllCheckboxChange = (event) => {
//     const { checked } = event.target;
//     setAllChecked(checked);
//     setCheckboxes(prevState => ({
//       option1: checked,
//       option2: checked,
//       option3: checked
//     }));
//   };

//   // const handleCheckboxChange = (event) => {
//   //   const { name, value } = event.target;
//   //   setCheckboxes(prevState => ({
//   //     ...prevState,
//   //     [name]: !prevState[name]
//   //   }));

//   //   console.log('Original eventsData:', eventsData);
  
//   //   const filteredData = eventsData.filter(event => {
//   //     const categoryIds = event.categories.map(category => category.category_id);
//   //     return categoryIds.includes(parseInt(value));
//   //   });
  
//   //   console.log('Filtered eventsData:', filteredData);
//   //   setEvents(filteredData);
//   // };

//   useEffect(() => {
//   const selectedCategories = Object.keys(checkboxes).filter(category => checkboxes[category]);

//   if (selectedCategories.length > 0) {
//     const filteredData = eventsData.filter(event => {
//       const categoryIds = event.categories.map(category => category.category_id);
//       return categoryIds.includes(parseInt(value));
//     });

//     setEvents(filteredData);
//   } else {
//     setEvents(initialEventsData); // Revert to the original data
//   }
// }, [checkboxes, eventsData, initialEventsData, setEvents]);

//   const handleCheckboxChange = (event) => {
//     const { name } = event.target;
//     setCheckboxes(prevState => ({
//       ...prevState,
//       [name]: !prevState[name]
//     }));
//   };



//   return (
//     <div className='Sidebar'>
//       <label>
//         <span>All</span>
//         <input
//           type="checkbox"
//           name="all"
//           checked={allChecked}
//           onChange={handleAllCheckboxChange}
//         />
//       </label>
//       <label>
//         <span>Option 1</span>
//         <input
//           type="checkbox"
//           name="option1"
//           value="1"
//           checked={checkboxes.option1}
//           onChange={handleCheckboxChange}
//         />
//       </label>
//       <label>
//         <span>Option 2</span>
//         <input
//           type="checkbox"
//           name="option2"
//           value="2"
//           checked={checkboxes.option2}
//           onChange={handleCheckboxChange}
//         />
//       </label>
//       <label>
//         <span>Option 3</span>
//         <input
//           type="checkbox"
//           name="option3"
//           value="3"
//           checked={checkboxes.option3}
//           onChange={handleCheckboxChange}
//         />
//       </label>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { useStateContext } from '../../context/ContextProvider';

// export default function Sidebar() {
//   const {eventsData, setEvents, initialEventsData} = useStateContext();
//   const [allChecked, setAllChecked] = useState(false);
//   const [checkboxes, setCheckboxes] = useState({
//     option1: false,
//     option2: false,
//     option3: false
//   });

//   const handleAllCheckboxChange = (event) => {
//     const { checked } = event.target;
//     setAllChecked(checked);
//     setCheckboxes(prevState => ({
//       option1: checked,
//       option2: checked,
//       option3: checked
//     }));
//   };

//   // const handleCheckboxChange = (event) => {
//   //   const { name, value } = event.target;
//   //   setCheckboxes(prevState => ({
//   //     ...prevState,
//   //     [name]: !prevState[name]
//   //   }));

//   //   console.log('Original eventsData:', eventsData);
  
//   //   const filteredData = eventsData.filter(event => {
//   //     const categoryIds = event.categories.map(category => category.category_id);
//   //     return categoryIds.includes(parseInt(value));
//   //   });
  
//   //   console.log('Filtered eventsData:', filteredData);
//   //   setEvents(filteredData);
//   // };

//   const handleCheckboxChange = (event) => {
//     const { name, value } = event.target;
//     setCheckboxes(prevState => ({
//       ...prevState,
//       [name]: !prevState[name]
//     }));

//     // console.log('Original eventsData:', eventsData);

//     const selectedCategories = Object.keys(checkboxes).filter(
//       category => checkboxes[category]
//     );
    
//     console.log(selectedCategories.length)
//     if (selectedCategories.length > 0) {
//          const filteredData = initialEventsData.filter(event => {
//       const categoryIds = event.categories.map(category => category.category_id);
//       return categoryIds.includes(parseInt(value));
//     });
    
//       // console.log('Filtered eventsData:', filteredData);
//       setEvents(filteredData);
//     } else {
//       setEvents(initialEventsData); // Revert to the original data
//     }
//   };

//   return (
//     <div className='Sidebar'>
//       <label>
//         <span>All</span>
//         <input
//           type="checkbox"
//           name="all"
//           checked={allChecked}
//           onChange={handleAllCheckboxChange}
//         />
//       </label>
//       <label>
//         <span>Option 1</span>
//         <input
//           type="checkbox"
//           name="option1"
//           value="1"
//           checked={checkboxes.option1}
//           onChange={handleCheckboxChange}
//         />
//       </label>
//       <label>
//         <span>Option 2</span>
//         <input
//           type="checkbox"
//           name="option2"
//           value="2"
//           checked={checkboxes.option2}
//           onChange={handleCheckboxChange}
//         />
//       </label>
//       <label>
//         <span>Option 3</span>
//         <input
//           type="checkbox"
//           name="option3"
//           value="3"
//           checked={checkboxes.option3}
//           onChange={handleCheckboxChange}
//         />
//       </label>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../context/ContextProvider';
import {
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
  } from '@mui/material';

export default function Sidebar() {
  const {eventsData, setEvents, initialEventsData} = useStateContext();
  const [category, setCategory] = useState([])

  const handleChange = (e) => {
    if (e.target.checked) {
      setCategory([...category, e.target.value]);
    } else {
      setCategory(category.filter(id => id !== e.target.value));
    }
  };

  const event = [
    { category_id: 1, category: "Option 1"},
    { category_id: 2, category: "Option 2"},
    { category_id: 3, category: "Option 3"},
    
  ];

  // OR COMPARISON

  // useEffect(() => {
  //   if (category.length === 0) {
  //     setEvents(initialEventsData);
  //   } else {
  //     setEvents(
  //       initialEventsData.filter(event =>
  //         event.categories.some(categoryObj =>
  //           category.includes(categoryObj.category_id.toString())
  //         )
  //       )
  //     );
  //   }
  // }, [category]);

  useEffect(() => {
    if (category.length === 0) {
      setEvents(initialEventsData);
    } else {
      setEvents(
        initialEventsData.filter(event =>
          category.every(categoryId =>
            event.categories.some(categoryObj =>
              categoryId === categoryObj.category_id.toString()
            )
          )
        )
      );
    }
  }, [category]);
  

  return (
    <div className='Sidebar'>
      <FormControl>
      <FormGroup>
  {event.map(event => (
    <FormControlLabel
      key={event.category_id}
      control={<Checkbox onChange={handleChange} />}
      label={event.category}
      value={event.category_id}
    />
  ))}
</FormGroup>
      </FormControl>
      
    </div>
  );
}

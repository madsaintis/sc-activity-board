// import React from 'react'
// import Sidebar from '../components/Calendar/Sidebar.jsx'
// import Calendar from '../components/Calendar/Calendar.jsx'
// import { useStateContext } from '../context/ContextProvider';
// import EventModal from '../components/Calendar/EventModal.jsx';

// export default function Home() {
//   const {showEventModal} = useStateContext();
//   return (
//     <React.Fragment>
//       {showEventModal && <EventModal />}
//       <div id='Calendar'>
//         <Sidebar />
//         <Calendar />
//       </div>
//     </React.Fragment>
//   )


// }

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Calendar/Sidebar';
import Calendar from '../components/Calendar/Calendar';
import { useStateContext } from '../context/ContextProvider';
import EventModal from '../components/Calendar/EventModal';

export default function Home() {
  const { showEventModal, eventsData } = useStateContext();
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const filtered = eventsData.filter((event) => selectedCategories.includes(event.category));
    setFilteredEvents(filtered);
  }, [selectedCategories, eventsData]);

  const handleCategoryChange = (selectedCategories) => {
    const categoryIds = selectedCategories.map(category => category.category_id);
    setSelectedCategories(categoryIds);
  };
  

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      <div id='Calendar'>
        <Sidebar onCategoryChange={handleCategoryChange} />
        <Calendar filteredEvents={filteredEvents} />
      </div>
    </React.Fragment>
  );
}

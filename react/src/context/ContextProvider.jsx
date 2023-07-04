import { useTheme } from "@mui/material";
import { createContext, useContext, useState } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext(
  {
    currentUser: null,
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
    setSelectedEvent: () => { },
    selectedEvent: null,
    setSelectedDate: () => { },
    selectedDate: null,
    getEvents: () => { },
    eventsData: null,
    initialEventsData: null,
    setEvents: () => { },
    setInitialEvents: () => { },
    categories: null,
    tags: null,
    setNotification: () => { },
    getTags: () => { },
    openCreationModal: null,
    setOpenCreationModal: () => { },
    openModal: null,
    setOpenModal: () => { },
    setFavouritedEvents: () => { },
    initialFavouritesEventsData: null
  }
)

export const ContextProvider = ({ children }) => {
  const [openCreationModal, setOpenCreationModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState({});
  const [tags, setTags] = useState([]);
  const [initialEventsData, setInitialEvents] = useState([]);
  const [eventsData, setEvents] = useState([]);
  const [initialFavouritedEventsData, setInitialFavouritedEvents] = useState([]);
  const [favouriteEventsData, setFavouritedEvents] = useState([]);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notification, _setNotification] = useState('');

  const theme = useTheme();

  // Display notification
  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)

  }

  // Retrieve token from server and store into local storage
  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token)
    }

    else {
      localStorage.removeItem('ACCESS_TOKEN')
    }
  }

  // Function to retrieve events from database
  const getEvents = () => {
    // Set events array as null
    setEvents([]);

    // GET request to API '/events'
    axiosClient.get('/events')
      .then((response) => {
        const events = response.data.data;
        if (Array.isArray(events)) {

          // Filter favourite events from events array
          const favouritedEvents = events.filter((event) => event.isFavourite || event.isOrganiser);

          // Save events arrays into states
          setInitialEvents(events);
          setEvents(events);
          setInitialFavouritedEvents(favouritedEvents);
          setFavouritedEvents(favouritedEvents);
        } else {
          console.log('Response data is not an array:', events);
        }
      })
      .catch((error) => {
        console.log('Error retrieving events:', error);
      });
  };


  // Retrieve all tags in database
  const getTags = () => {

    // GET request to API '/categories' 
    axiosClient
      .get("/categories")
      .then((response) => {
        const categories = response.data;

        // Save tags into tags variable
        setTags(categories);
      })

      // Catch error returned by server
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };



  return (
    <StateContext.Provider value={{
      user,
      token,
      setUser,
      setToken,
      selectedEvent,
      setSelectedEvent,
      selectedDate,
      setSelectedDate,
      getEvents,
      eventsData,
      setEvents,
      initialEventsData,
      setNotification,
      notification,
      favouriteEventsData,
      getTags,
      tags,
      openCreationModal,
      setOpenCreationModal,
      openModal,
      setOpenModal,
      theme,
      setFavouritedEvents,
      initialFavouritedEventsData
    }}>
      {children}
    </StateContext.Provider>
  )

}

export const useStateContext = () => useContext(StateContext);
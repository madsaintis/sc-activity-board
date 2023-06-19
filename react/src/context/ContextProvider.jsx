import { createContext, useContext, useState } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext(
    {
        currentUser: null,
        user: null,
        token: null,
        setUser: () => {},
        setToken: () => {},
        showEventModal: false,
        setShowEventModal: () => {},
        setSelectedEvent: () => {},
        selectedEvent: null,
        setSelectedDate: () => {},
        selectedDate: null,
        getEvents: () => {},
        eventsData: null,
        initialEventsData: null,
        label: null,
        setLabel: () => {},
        setEvents: () => {},
        setInitialEvents: () => {},
        categories: null,
        tags: null,
        setNotification: () => {},
        getTags: () => {},
        verifyEmail: null,
        setVerifyEmail: () => {}
    }
)

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [tags, setTags] = useState([]);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [initialEventsData, setInitialEvents] = useState([]);
    const [eventsData, setEvents] = useState([]);
    const [favouriteEventsData, setFavouritedEvents] = useState([]);
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [label, setLabel] = useState(null);
    const [notification, _setNotification] = useState('');
    

    const categories = [
        { value: '1', label: 'Year 1', color: 'red' },
        { value: '2', label: 'Year 2', color: 'blue' },
        { value: '3', label: 'Year 3', color: 'green' },
        { value: '4', label: 'Year 4', color: 'yellow' },
        { value: '5', label: 'Postgraduate', color: 'orange' },
        { value: '6', label: 'Academic', color: 'teal' },
        { value: '7', label: 'Career', color: 'purple' },
        { value: '8', label: 'Cultural', color: 'brown' },
        { value: '9', label: 'Examination', color: 'magenta' },
        { value: '10', label: 'Sports', color: 'pink' },
    ];

    const setNotification = (message) => {
        _setNotification(message);
    
        setTimeout(() => {
          _setNotification('')
        }, 5000)

        console.log(message)
      }

    const setToken = (token) => {
        _setToken(token)
        if(token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } 
        
        else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    const getEvents = () => {
      setEvents([]);
        axiosClient.get('/events')
        .then((response) => {
          const events = response.data.data;
          if (Array.isArray(events)) {
            const favouritedEvents = events.filter((event) => event.isFavourite);
            // console.log(favouritedEvents);
            setInitialEvents(events);
            setEvents(events);
            setFavouritedEvents(favouritedEvents);
          } else {
            console.log('Response data is not an array:', events);
          }
        })
        .catch((error) => {
          console.log('Error retrieving events:', error);
        });
      };

    
      const getTags = () => {
        axiosClient
          .get("/categories") // Replace "/categories" with the actual API endpoint for fetching categories
          .then((response) => {
            const categories = response.data;
            setTags(categories);
            // Process the retrieved categories as needed
          })
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
            showEventModal,
            setShowEventModal,
            selectedEvent,
            setSelectedEvent,
            selectedDate,
            setSelectedDate,
            getEvents,
            eventsData,
            label,
            setLabel,
            setEvents,
            initialEventsData,
            categories,
            setNotification,
            notification,
            favouriteEventsData,
            getTags,
            tags,
            verifyEmail,
            setVerifyEmail
        }}>
            {children}
        </StateContext.Provider>
    )
    
}

export const useStateContext = () => useContext(StateContext);
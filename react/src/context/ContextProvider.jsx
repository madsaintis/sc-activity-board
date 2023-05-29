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
        setInitialEvents: () => {}
    }
)

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [initialEventsData, setInitialEvents] = useState([]);
    const [eventsData, setEvents] = useState([]);
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [label, setLabel] = useState(null);

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
        axiosClient.get('/events').then(({data}) => {
          setInitialEvents(data.data)
          setEvents(data.data)
        })
        .catch(() => {
        })
      }

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
            initialEventsData
        }}>
            {children}
        </StateContext.Provider>
    )
    
}

export const useStateContext = () => useContext(StateContext);
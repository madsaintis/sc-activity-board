import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { faDeleteLeft, faEllipsisV, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useStateContext } from '../../context/ContextProvider'
import { useRef } from 'react';
import axiosClient from '../../axios-client';
import LabelField from './LabelField';

export default function EventModal() {

    const titleRef = useRef();
    const LocationRef = useRef();
    const descriptionRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    
  const {setShowEventModal, selectedEvent, setSelectedEvent, selectedDate, user, getEvents, setSelectedDate} = useStateContext();

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.event.title : "");
  const [description, setDescription] = useState(selectedEvent ? selectedEvent.event.extendedProps.description : "");
  const [location, setLocation] = useState(selectedEvent ? selectedEvent.event.extendedProps.location : "");
  const [startTime, setStartTime] = useState(selectedEvent ? selectedEvent.event.extendedProps.startTime : "");
  const [endTime, setEndTime] = useState(selectedEvent ? selectedEvent.event.extendedProps.endTime : "");
  const [label, setLabel] = useState(null);

  useEffect( () => {
    console.log(selectedEvent.event.extendedProps.categories)
  }, [])

  const onSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: titleRef.current.value,
      location: LocationRef.current.value,
      description: descriptionRef.current.value,
      start_time: startTimeRef.current.value,
      end_time: endTimeRef.current.value,
      date: selectedDate,
      organiser: user.id,
      categories: label.map(option => option.value)
    };
    axiosClient.post('/events', payload)
      .then((response) => {
        getEvents();
        setShowEventModal(null);
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = (event) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return
    }
    axiosClient.delete(`/events/${selectedEvent.event.id}`)
      .then(() => {
        getEvents();
        alert('Event was successfully deleted');
        setShowEventModal(false);
        setSelectedEvent(null);
      })};

      const handleLabelChange = (selectedOption) => {;
        setLabel(selectedOption);
      };

return (
    <div className='EventModal animated fadeInDown'>
      <div className='EventCreationScreen'>
        <form onSubmit={onSubmit}>
        {(selectedEvent?.event?.extendedProps.organiser == user.id ) && <button className="btn-delete" onClick={onDelete}>
                   <FontAwesomeIcon icon={faTrash} />
            </button>}

        <button className="btn-close" onClick={ function(){
                     setShowEventModal(false);
                    setSelectedEvent(null);
                    setSelectedDate(null);
                    }}>
                   <FontAwesomeIcon icon={faTimesCircle} />
            </button>

          {!selectedEvent && <h1 className='title'>
            Create Event
          </h1>}
          
          
          <label>Title</label>
          <input 
            ref={titleRef} 
            placeholder='Title' 
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)} 
            />

          <label>Location</label>
          <input ref={LocationRef} placeholder='Location' 
          defaultValue={location}
            onChange={(e) => setLocation(e.target.value)} 
            />

          <label>Description</label>
          <textarea ref={descriptionRef} placeholder='Description' 
          defaultValue={description}
            onChange={(e) => setDescription(e.target.value)} 
            />

          <label>Start Time:</label>
          <input ref={startTimeRef} type="time" id="startTime" defaultValue={startTime} onChange={(e) => setStartTime(e.target.value)}/>

          <label>End Time:</label>
          <input ref={endTimeRef} type="time" id="endTime" defaultValue={endTime} onChange={(e) => setEndTime(e.target.value)}/>
          
          <LabelField onLabelChange={handleLabelChange}/>
          
          {!selectedEvent &&
          <button className='btn btn-block'>Create</button>}
          <button className='btn btn-block' onClick={(event) => {
            event.preventDefault();
            console.log(label);
            }}>HAHA</button>
          
          {/* { errors && <div className='alert'>
            {  Object.keys(errors).map(key => (
              <p>{errors[key][0]}</p>
            )
            )}
          </div>
          } */}
        </form>
      </div>
      
    </div>
  )
}

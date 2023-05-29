import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../../context/ContextProvider";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import LabelField from "./LabelField";
import { Button, Typography } from '@mui/material';

export default function EventModal() {
  const titleRef = useRef();
  const LocationRef = useRef();
  const descriptionRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();

  const {
    setShowEventModal,
    selectedEvent,
    setSelectedEvent,
    selectedDate,
    user,
    getPublicEvents,
    setSelectedDate,
  } = useStateContext();

  const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.event.title : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.description : ""
  );
  const [location, setLocation] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.location : ""
  );
  const [startTime, setStartTime] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.startTime : ""
  );
  const [endTime, setEndTime] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.endTime : ""
  );
  const [label, setLabel] = useState([]);
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isPublic, setIsPublic] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.isPublic : false
  );

  const defaultCategories =
    selectedEvent?.event?.extendedProps?.categories?.map((category) => ({
      value: String(category.category_id),
      label: category.category_name,
    }));

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewURL(reader.result);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    console.log('isPublic:', isPublic);
  }, [isPublic]);

  const handleImageRemove = () => {
    setImage(null);
    setPreviewURL(null);
  };

  const handleLabelChange = (selectedOption) => {
    setLabel(selectedOption);
  };

  const handleVisibilityChange = (event) => {
    const checkboxId = event.target.id;
    if (checkboxId === 'privateCheckbox') {
      setIsPublic(false);
    } else if (checkboxId === 'publicCheckbox') {
      setIsPublic(true);
    }
  };

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
      categories: label.map((option) => option.value),
      is_public: isPublic
    };
    axiosClient
      .post("/events", payload)
      .then((response) => {
        getPublicEvents();
        setShowEventModal(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = (event) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    axiosClient.delete(`/events/${selectedEvent.event.id}`).then(() => {
      getPublicEvents();
      alert("Event was successfully deleted");
      setShowEventModal(false);
      setSelectedEvent(null);
    });
  };

  return (
    <div className="EventModal animated fadeInDown">
      <div className="EventCreationScreen">
        <form onSubmit={onSubmit}>
          {selectedEvent?.event?.extendedProps.organiser === user.id || (user.role === 'Admin' && selectedEvent) && (
  <button className="btn-delete" onClick={onDelete}>
    <FontAwesomeIcon icon={faTrash} />
  </button>
)}

          <button
            className="btn-close"
            onClick={function () {
              setShowEventModal(false);
              setSelectedEvent(null);
              setSelectedDate(null);
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>

          {!selectedEvent ? (
            <h1 className="title">Create Event</h1>
          ) : (
            <h1 className="title">{selectedEvent.event.title}</h1>
          )}

          {/* <label>Upload Image:</label>
          <input type="file" onChange={handleImageUpload} />

          {previewURL && (
            <div>
              <h2>Image Preview:</h2>
              <img src={previewURL} alt="Preview" style={{ width: "200px" }} />
            </div>
          )} */}

<input
        accept="image/*"
        type="file"
        id="image-upload"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <label htmlFor="image-upload">
        <Button variant="contained" component="span">
          Upload Image
        </Button>
      </label>

      {previewURL && (
        <div>
          <Typography variant="h6">Image Preview:</Typography>
          <img src={previewURL} alt="Preview" style={{ maxWidth: '100%' }} />

          <Button variant="contained" color="secondary" onClick={handleImageRemove}>
            Remove
          </Button>
        </div>
      )}

          <label>Title</label>
          <input
            ref={titleRef}
            placeholder="Title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Location</label>
          <input
            ref={LocationRef}
            placeholder="Location"
            defaultValue={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Description</label>
          <textarea
            ref={descriptionRef}
            placeholder="Description"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Start Time:</label>
          <input
            ref={startTimeRef}
            type="time"
            id="startTime"
            defaultValue={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label>End Time:</label>
          <input
            ref={endTimeRef}
            type="time"
            id="endTime"
            defaultValue={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

<label>Label</label>
          {selectedEvent ? (
            <LabelField
              onLabelChange={handleLabelChange}
              defaultCategories={defaultCategories}
            />
          ) : (
            <LabelField onLabelChange={handleLabelChange} />
          )}

<label>Visibility</label>
<div>
  <label>
  Private
    <input
      type="checkbox"
      id="privateCheckbox"
      checked={!isPublic}
      onChange={handleVisibilityChange}
      disabled={user.role === "Event Participant"}
    />

  </label>
  <label>
  Public
    <input
      type="checkbox"
      id="publicCheckbox"
      checked={isPublic}
      onChange={handleVisibilityChange}
      disabled={user.role === "Event Participant"}
    />
  </label>
</div>
          {!selectedEvent && <button className="btn btn-block">Create</button>}
          {/* <button
            className="btn btn-block"
            onClick={(event) => {
              event.preventDefault();
              console.log(label);
            }}
          >
            Edit
          </button> */}

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
  );
}

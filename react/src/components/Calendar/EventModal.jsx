import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../../context/ContextProvider";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import LabelField from "./LabelField";
import { Button, Typography } from "@mui/material";

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
    getEvents,
    setSelectedDate,
    setNotification,
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

  const [image, setImage] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.image : null
  );
  const [previewURL, setPreviewURL] = useState(null);
  const [isPublic, setIsPublic] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.isPublic : false
  );

  const defaultCategories =
    selectedEvent?.event?.extendedProps?.categories?.map((category) => ({
      value: String(category.category_id),
      label: category.category_name,
    }));

  const [label, setLabel] = useState(selectedEvent ? defaultCategories : []);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewURL(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // useEffect(() => {
  //   console.log('imagec:', label);
  // }, [label]);

  const handleImageRemove = () => {
    setImage(null);
    setPreviewURL(null);
  };

  const handleLabelChange = (selectedOption) => {
    setLabel(selectedOption);
  };

  const handleVisibilityChange = (event) => {
    const checkboxId = event.target.id;
    if (checkboxId === "privateCheckbox") {
      setIsPublic(false);
    } else if (checkboxId === "publicCheckbox") {
      setIsPublic(true);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("location", LocationRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("start_time", startTimeRef.current.value);
    formData.append("end_time", endTimeRef.current.value);
    formData.append("date", selectedDate.toISOString());
    formData.append("organiser", user.id);
    formData.append("is_public", isPublic ? "1" : "0");

    if (image) {
      // Append the poster field only if an image is selected
      formData.append("poster", image);
    }

    label.forEach((option) => {
      formData.append("categories[]", option.value);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axiosClient
      .post("/events", formData, config)
      .then((response) => {
        getEvents();
        setShowEventModal(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onUpdate = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("title", titleRef.current.value);
    formData.append("location", LocationRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("start_time", startTimeRef.current.value);
    formData.append("end_time", endTimeRef.current.value);
    formData.append("date", selectedDate);
    formData.append("organiser", user.id);
    formData.append("is_public", isPublic ? "1" : "0");

    // Add condition to append the updated poster image if available
  //   if (image) {
  //     const file = base64ToFile(image, 'image.jpg');
  // formData.append('poster', file);
  //   }

    label.forEach((option) => {
      formData.append("categories[]", option.value);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // Make a PUT request instead of POST for updating an existing event
    axiosClient
      .post(`/events/${selectedEvent.event.id}`, formData, config) // Replace `eventId` with the ID of the event being updated
      .then((response) => {
        setNotification("Event edited successfully.")
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
      return;
    }
    axiosClient.delete(`/events/${selectedEvent.event.id}`).then(() => {
      getEvents();
      setNotification("Event was successfully deleted");
      setShowEventModal(false);
      setSelectedEvent(null);
    });
  };

  useEffect(() => {
    console.log(selectedEvent?.event?.extendedProps.organiser);
    console.log(user.role);
  }, [selectedEvent]);
  return (
    <div className="EventModal animated fadeInDown">
      <div className="EventCreationScreen">
        <form onSubmit={onSubmit}>
          {(selectedEvent?.event?.extendedProps.organiser == user.id ||
            (user.role === "Admin" && selectedEvent)) && 
              <button className="btn-delete" onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            }
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
          {!selectedEvent && (
            <>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </>
          )}
          {previewURL && (
            <div>
              <Typography variant="h6">Image Preview:</Typography>
              <img
                src={previewURL}
                alt="Preview"
                style={{ maxWidth: "100%" }}
              />

              <Button
                variant="contained"
                color="secondary"
                onClick={handleImageRemove}
              >
                Remove
              </Button>
            </div>
          )}

          {image ? (
            <img src={`data:image/jpeg;base64,${image}`} alt="Poster" />
          ) : (
            <p style={{ color: "gray" }}>No poster uploaded</p>
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
          {!selectedEvent && (
            <button className="btn btn-block">Create</button>
          ) }
          
          {selectedEvent?.event?.extendedProps.organiser == user.id && 
          <button className="btn btn-block" onClick={onUpdate}>
              Edit
            </button>}
            
          
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

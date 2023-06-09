import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  faTimesCircle,
  faTrash,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../../context/ContextProvider";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import LabelField from "./LabelField";
import { Button, IconButton } from "@mui/material";
import ModalImage from "react-modal-image";
import CloseIcon from "@mui/icons-material/Close";

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

  const [changed, setChanged] = useState(false);

  const [previewURL, setPreviewURL] = useState(null);

  const largerImageURL = `data:image/jpeg;base64,${image}`;

  const [isPublic, setIsPublic] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.isPublic : false
  );

  const defaultCategories =
    selectedEvent?.event?.extendedProps?.categories?.map((category) => ({
      value: String(category.category_id),
      label: category.category_name,
    }));

  const [label, setLabel] = useState(selectedEvent ? defaultCategories : []);

  const [isStarred, setIsStarred] = useState(selectedEvent ? selectedEvent.event.extendedProps.isFavourite : false);
  
  console.log(selectedEvent)
  // End of Variable Declaration
  // -------------------------------------------------------------------------------------/

  const addToFavorites = () => {
    const favoriteData = {
      userId: user.id,
      eventId: selectedEvent.event.id,
    };

    axiosClient
      .post("/favourites", favoriteData)
      .then((response) => {
        // Add any necessary logic here
        console.log("Event added to favorites");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeFromFavorites = () => {
    console.log("HELLO");
    axiosClient
      .delete(`/favourites/${user.id}/${selectedEvent.event.id}`)
      .then((response) => {
        // Add any necessary logic here
        console.log("Event removed from favorites");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Image Upload Function
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setChanged(true);
    setImage(file);
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewURL(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Image Removal Function
  const handleImageRemove = () => {
    setChanged(true);
    setImage(null);
    setPreviewURL(null);
  };

  // Check labels of event
  const handleLabelChange = (selectedOption) => {
    setLabel(selectedOption);
  };

  // Check if event is public or not
  const handleVisibilityChange = (event) => {
    const checkboxId = event.target.id;
    if (checkboxId === "privateCheckbox") {
      setIsPublic(false);
    } else if (checkboxId === "publicCheckbox") {
      setIsPublic(true);
    }
  };

  // Handle star button click
  const handleStarClick = () => {
    setIsStarred((prevIsStarred) => !prevIsStarred);
    if (!isStarred) {
      addToFavorites();
    } else {
      removeFromFavorites();
    }

    getEvents();
  };

  // Event Creation Function
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
        setNotification("Event created successfully");
        setShowEventModal(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Event Update Function
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
    formData.append("changed", changed);

    // Add condition to append the updated poster image if available
    if (changed) {
      if (image) formData.append("poster", image);
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
      .post(`/events/${selectedEvent.event.id}`, formData, config)
      .then((response) => {
        setNotification("Event edited successfully.");
        getEvents();
        setShowEventModal(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Event Deletion Function
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

  return (
    <div className="EventModal animated fadeInDown">
      <div className="EventCreationScreen">
        <form onSubmit={onSubmit}>
          {(selectedEvent?.event?.extendedProps.organiser == user.id ||
            (user.role === "Admin" && selectedEvent)) && (
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
            <h1 className="title">
              {selectedEvent.event.title}
              <FontAwesomeIcon
                icon={faStar}
                onClick={handleStarClick}
                color={isStarred ? "#FFC107" : "inherit"}
              />
            </h1>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!previewURL && !image ? (
              <div>
                {/* Your existing code for the file input */}
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                {/* Your existing code for the label and button */}
                <label htmlFor="image-upload">
                  <Button variant="contained" component="span">
                    Upload Image
                  </Button>
                </label>
              </div>
            ) : (
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "40vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  // border: "2px solid blue",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <ModalImage
                  small={previewURL || largerImageURL}
                  large={previewURL || largerImageURL}
                  // alt={previewURL ? "Preview" : "Poster"}
                  hideDownload={true}
                  hideZoom={true}
                />

                {/* X button */}
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                  }}
                >
                  <IconButton
                    onClick={handleImageRemove}
                    size="small"
                    style={{
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      fontSize: "0.5rem",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </div>

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

          {selectedEvent?.event?.extendedProps.organiser == user.id && (
            <button className="btn btn-block" onClick={onUpdate}>
              Edit
            </button>
          )}

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

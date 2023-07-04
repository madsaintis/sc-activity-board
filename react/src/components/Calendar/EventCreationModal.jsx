import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { faTimesCircle, faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../../context/ContextProvider";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, ListSubheader, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import ModalImage from "react-modal-image";
import { Search, Description, LocationOn, Sell, Title, Schedule, KeyboardReturn } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TagSearch from "./TagSearch";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useEffect } from "react";

const containsText = (text, searchText) => text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export default function EventCreationModal() {
  const titleRef = useRef();
  const LocationRef = useRef();
  const descriptionRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();

  const [isDisabled, setIsDisabled] = useState(false);
  const [errors, setErrors] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { selectedEvent, setSelectedEvent, selectedDate, user, getEvents, setSelectedDate, setNotification, openCreationModal, setOpenCreationModal } = useStateContext();
  const [title, setTitle] = useState(selectedEvent ? selectedEvent.event.title : "");
  const [description, setDescription] = useState(selectedEvent ? selectedEvent.event.extendedProps.description : "");
  const [location, setLocation] = useState(selectedEvent ? selectedEvent.event.extendedProps.location : "");
  const [startTime, setStartTime] = useState(selectedEvent ? dayjs(selectedEvent.event.extendedProps.startTime) : null);
  const [endTime, setEndTime] = useState(selectedEvent ? dayjs(selectedEvent.event.extendedProps.endTime) : null);
  const [image, setImage] = useState(selectedEvent ? selectedEvent.event.extendedProps.image : null);
  const [changed, setChanged] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const largerImageURL = `data:image/jpeg;base64,${image}`;
  const [isPublic, setIsPublic] = useState(
    selectedEvent ? (selectedEvent.event.extendedProps.isPublic === 1 ? true : false) : false
  );
  const [selectedOption, setSelectedOption] = useState(
    selectedEvent
      ? selectedEvent.event.extendedProps.categories.map((category) => ({
        tag_id: category.tag_id,
        tag_name: category.tag_name,
        tag_colour: category.tag_colour
      }))
      : []
  );

  // End of Variable Declaration
  // -------------------------------------------------------------------------------------/

  // Handle if user click close button
  const handleCloseModal = () => {
    setOpenCreationModal(false);
    setSelectedEvent(null);
  };

  // Handle check if user is an Event Participant
  const isEventParticipant = () => {
    if (user.role === 'Event Participant')
      return true;

    return false;
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
    setSelectedOption(selectedOption);
  };

  // Reformat start and end time
  const reformatDate = (date1, date2) => {
    const isoString1 = date1.toISOString();
    const isoString2 = new Date(date2["$d"]).toISOString();

    const newDate1 = new Date(isoString1);
    const newDate2 = new Date(isoString2);

    newDate2.setFullYear(newDate1.getFullYear());
    newDate2.setMonth(newDate1.getMonth());
    newDate2.setDate(newDate1.getDate());

    return newDate2.toISOString();
  };

  // Event Creation Function
  const onSubmit = (event) => {
    event.preventDefault();
    setIsDisabled(true);

    // Reformat selected time from time picker field
    const newStartTime = reformatDate(selectedDate, startTime);
    const newEndTime = reformatDate(selectedDate, endTime);

    // Create new form data to be submitted to the API
    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("location", LocationRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("start_time", newStartTime);
    formData.append("end_time", newEndTime);
    formData.append("date", selectedDate.toISOString());
    formData.append("organiser_id", user.id);
    formData.append("is_public", isPublic ? "1" : "0");
    if (image) {
      // Append the poster field only if an image is uploaded
      formData.append("poster", image);
    }
    selectedOption.forEach((option) => { formData.append("categories[]", option.tag_id); });

    // Set the content type to multipart/form-data
    const config = { headers: { "Content-Type": "multipart/form-data", }, };

    // POST request to API '/events'
    axiosClient.post("/events", formData, config).then((response) => {
      setIsDisabled(false);
      getEvents();
      setNotification("Event created successfully");
      handleCloseModal();

    })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setIsDisabled(false);
          setErrors(response.data.errors);
        } else {
          setIsDisabled(false);
          setErrors("An error occurred while creating event. Please try again.");
        }
      });
  };

  // Event Update Function
  const onUpdate = (event) => {
    event.preventDefault();
    setIsDisabled(true);

    // Reformat selected time from time picker field
    const newStartTime = reformatDate(selectedDate, startTime);
    const newEndTime = reformatDate(selectedDate, endTime);

    // Create new form data to be submitted to the API
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", titleRef.current.value);
    formData.append("location", LocationRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("start_time", newStartTime);
    formData.append("end_time", newEndTime);
    formData.append("date", selectedDate.toISOString());
    formData.append("organiser_id", user.id);
    formData.append("is_public", isPublic ? "1" : "0");
    formData.append("changed", changed);

    // Add change condition to append the updated poster image if there is any
    if (changed) { if (image) formData.append("poster", image); }

    selectedOption.forEach((option) => { formData.append("categories[]", option.tag_id); });

    // Set the content type to multipart/form-data
    const config = { headers: { "Content-Type": "multipart/form-data", }, };

    // POST request to API '/events' but with PUT method in FormData
    axiosClient
      .post(`/events/${selectedEvent.event.id}`, formData, config)
      .then((response) => {
        setNotification("Event edited successfully.");
        getEvents();
        setIsDisabled(false);
      })

      // Handle exception thrown by server
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
          setIsDisabled(false);
        }
      });
  };

  // Event Deletion Function
  const onDelete = (event) => {
    event.preventDefault();
    setIsDisabled(true);

    // Asks for user confirmation
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    // DELETE request to API '/events'
    axiosClient.delete(`/events/${selectedEvent.event.id}`).then(() => {
      getEvents();
      setNotification("Event was successfully deleted");
      setIsDisabled(false);
      setOpenCreationModal(false);
      setSelectedEvent(null);
    });
  };

  return (
    <Modal className="event-modal-wrapper"
      open={openCreationModal}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") {
          return;
        }
        handleCloseModal();
      }}
    >
      <Box className="event-modal">
        <form onSubmit={onSubmit}>
          <div className="modal-header">
            <div className="header-flex-container">
              <div className="btn-container">
                {selectedEvent && (
                  <button className="btn-delete" onClick={onDelete} disabled={isDisabled}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              <div className="title-container">
                <h1 className="title">
                  {!selectedEvent ? "Create Event" : selectedEvent.event.title}
                </h1>
              </div>
              <div className="btn-container">
                <button
                  className="btn-close"
                  onClick={() => {
                    setOpenCreationModal(false);
                    setSelectedEvent(null);
                    setSelectedDate(null);
                  }}
                >
                  <KeyboardReturn />
                </button>
              </div>
            </div>
          </div>

          <div className="modal-content">

            {!previewURL && !image ? (
              <div className="upload-button">
                <input accept="image/*" type="file" id="image-upload" style={{ display: "none" }} onChange={handleImageUpload} />
                <label htmlFor="image-upload">
                  <Button variant="contained" component="span" sx={{ backgroundColor: '#5d576b', marginTop: "10px" }}>
                    Upload Poster
                  </Button>
                </label>
              </div>
            ) : (
              <div className="image-preview">
                <div className="image-box">
                  <ModalImage
                    small={previewURL || largerImageURL}
                    large={previewURL || largerImageURL}
                    hideDownload={true}
                    hideZoom={true}
                  />
                </div>

                <div className="upload-button">
                  <input accept="image/*" type="file" id="image-upload" style={{ display: "none" }} onChange={handleImageUpload} />
                  <label htmlFor="image-upload">
                    <Button variant="contained" component="span" sx={{ backgroundColor: '#5d576b', marginTop: "10px" }}>
                      Upload Poster
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>

          <Box className="textfield-box">
            <Title className="textfield-icon"/>
            <TextField fullWidth inputRef={titleRef} label="Title" variant="outlined" margin="dense" size="small" defaultValue={title} />
          </Box>

          <Box className="textfield-box">
            <LocationOn className="textfield-icon"/>
            <TextField fullWidth inputRef={LocationRef} label="Location" variant="outlined" margin="dense" size="small" defaultValue={location} />
          </Box>

          <Box className="textfield-box">
            <Description className="textfield-icon"/>
            <TextField fullWidth inputRef={descriptionRef} label="Description" variant="outlined" margin="dense" size="small" defaultValue={description} multiline />
          </Box>

          <Box className="textfield-box">
            <Sell className="textfield-icon"/>
            <TagSearch onLabelChange={handleLabelChange} defaultCategories={selectedOption} />
          </Box>

          <Box className="create-time-box">
            <Typography className="create-time-label" variant="body1">
              <Schedule className="create-time-icon" />
              Time
            </Typography>

            <Box className="pick-time-box">
              <TimePicker label="Start Time" value={startTime} inputRef={startTimeRef} onChange={(newValue) => setStartTime(newValue)} />

              <Box className="hyphen-box">
                <Typography variant="body1">
                  -
                </Typography>
              </Box>

              <TimePicker label="End Time" value={endTime} inputRef={endTimeRef} skipDisabled onChange={(newValue) => setEndTime(newValue)} disabled={!startTime} minTime={startTime} />
            </Box>
          </Box>

          <FormControlLabel
            label="Publish event to public?"
            labelPlacement="end"
            control={
              <Checkbox
                disabled={isEventParticipant()}
                checked={isPublic}
                color="secondary"
                onChange={() => setIsPublic(!isPublic)}
                id="publicCheckbox"
              />
            }
          />

          {!selectedEvent && <button className="btn btn-block" disabled={isDisabled}>Create</button>}

          {selectedEvent?.event?.extendedProps.organiser === user.name && (
            <button className="btn btn-block" onClick={onUpdate} disabled={isDisabled}>
              Edit
            </button>
          )}

          {errors && (
            <Alert severity="error">
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}
        </form>
      </Box>
    </Modal>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import {
  faTimesCircle,
  faTrash,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useStateContext } from "../../context/ContextProvider";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import LabelField from "./LabelField";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ModalImage from "react-modal-image";
import { Search, Description, LocationOn, Sell, Title, Schedule } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TestSearch from "./TestSearch";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useEffect } from "react";

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const allOptions = ["Option One", "Option Two", "Option Three", "Option Four"];

export default function EventModal() {
  const titleRef = useRef();
  const LocationRef = useRef();
  const descriptionRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  
  const [errors, setErrors] = useState(null);
  const [searchText, setSearchText] = useState("");
  const displayedOptions = useMemo(
    () => allOptions.filter((option) => containsText(option, searchText)),
    [searchText]
  );
  
  const {
    setShowEventModal,
    selectedEvent,
    setSelectedEvent,
    selectedDate,
    user,
    getEvents,
    setSelectedDate,
    setNotification,
    openModal,
    setOpenModal
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
    selectedEvent ? dayjs(selectedEvent.event.extendedProps.startTime) : null
  );
  const [endTime, setEndTime] = useState(
    selectedEvent ? dayjs(selectedEvent.event.extendedProps.endTime) : null
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

  const [selectedOption, setSelectedOption] = useState(selectedEvent ? selectedEvent.event.extendedProps.categories.map(category => ({
    tag_id: category.tag_id,
    tag_name: category.tag_name
  })) : []);
  
  const [isStarred, setIsStarred] = useState(
    selectedEvent ? selectedEvent.event.extendedProps.isFavourite : false
  );

  // useEffect(() => {

  //   setTitle(selectedEvent ? selectedEvent.event.title : "");
  //   setDescription(selectedEvent ? selectedEvent.event.extendedProps.description : "");
  //   setLocation(selectedEvent ? selectedEvent.event.extendedProps.location : "");
  //   setStartTime(selectedEvent ? selectedEvent.event.extendedProps.startTime : "");
  //   setEndTime(selectedEvent ? selectedEvent.event.extendedProps.endTime : "");
  //   setImage(selectedEvent ? selectedEvent.event.extendedProps.image : null);
  //   setChanged(false);
  //   setIsPublic(selectedEvent ? selectedEvent.event.extendedProps.isPublic : false);
  //   setSelectedOption(
  //     selectedEvent
  //       ? selectedEvent.event.extendedProps.categories.map((category) => ({
  //           tag_id: category.tag_id,
  //           tag_name: category.tag_name,
  //         }))
  //       : []
  //   );
  //   setIsStarred(selectedEvent ? selectedEvent.event.extendedProps.isFavourite : false);
  // }, [selectedEvent]);
  

  // End of Variable Declaration
  // -------------------------------------------------------------------------------------/

    const handleCloseModal = () => {
      setOpenModal(false);
      setSelectedEvent(null);
    }

  const addToFavorites = () => {
    const favoriteData = {
      userId: user.id,
      eventId: selectedEvent.event.id,
    };

    axiosClient
      .post("/favourites", favoriteData)
      .then((response) => {
        // Add any necessary logic here
        setNotification("Event added to favorites");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeFromFavorites = () => {
    axiosClient
      .delete(`/favourites/${user.id}/${selectedEvent.event.id}`)
      .then((response) => {
        // Add any necessary logic here
        setNotification("Event removed from favorites");
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

    setSelectedOption(selectedOption);
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
    console.log(selectedOption)
    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("location", LocationRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("start_time", startTime.toISOString());
    formData.append("end_time", endTime.toISOString());
    formData.append("date", selectedDate.toISOString());
    formData.append("organiser_id", user.id);
    formData.append("is_public", isPublic ? "1" : "0");

    if (image) {
      // Append the poster field only if an image is selected
      formData.append("poster", image);
    }

    selectedOption.forEach((option) => {
      
      formData.append("categories[]", option.tag_id);
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
        handleCloseModal();
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          setErrors("An error occurred while creating event. Please try again.");
        }
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
    formData.append("start_time", startTime.toISOString());
    formData.append("end_time", endTime.toISOString());
    formData.append("date", selectedDate);
    formData.append("organiser_id", user.id);
    formData.append("is_public", isPublic ? "1" : "0");
    formData.append("changed", changed);

    // Add condition to append the updated poster image if available
    if (changed) {
      if (image) formData.append("poster", image);
    }

    selectedOption.forEach((option) => {
      formData.append("categories[]", option.tag_id);
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
      })
      .catch(err => {
        const response = err.response;
        console.log("woi")
        console.log(response)
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
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
    <Modal open={openModal}
    onClose={handleCloseModal}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0
    }}
    >
      <Box sx={{
            width: "50%", // Customize the width as needed
            bgcolor: "background.paper",
            alignItems: "center",
      justifyContent: "center",
            p: 2,
          }}>
        <form onSubmit={onSubmit}>
          {(selectedEvent?.event?.extendedProps.organiser == user.name ||
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Title
              sx={{
                color: "action.active",
                mr: 1,
                my: 0.5,
                alignSelf: "center",
              }}
            />
            <TextField
              fullWidth
              inputRef={titleRef}
              label= "Title"
              variant="outlined"
              margin="dense"
              size="small"
              defaultValue={title}
            />
          </Box>

<Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOn
              sx={{
                color: "action.active",
                mr: 1,
                my: 0.5,
                alignSelf: "center",
              }}
            />
            <TextField
              fullWidth
              inputRef={LocationRef}
              label= "Location"
              variant="outlined"
              margin="dense"
              size="small"
              defaultValue={location}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Description
              sx={{
                color: "action.active",
                mr: 1,
                my: 0.5,
                alignSelf: "center",
              }}
            />
            <TextField
              fullWidth
              inputRef={descriptionRef}
              label= "Description"
              variant="outlined"
              margin="dense"
              size="small"
              defaultValue={description}
              multiline
            />
          </Box>

          <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    mb: 2,
  }}
>
<Box
    sx={{
      display: "flex",
      alignItems: "center",
      mr: 1,
    }}
  >
    <Schedule
      sx={{
        color: "action.active",
        mr: 0.5,
        my: 0,
      }}
    />
    <Typography variant="body1">Schedule Label</Typography>
  </Box>
  <TimePicker
    label="Time 1"
    value={startTime}
    onChange={(newValue) => setStartTime(newValue)}
  />
  <TimePicker
    label="Time 2"
    value={endTime}
    onChange={(newValue) => {
      console.log(newValue);
      setEndTime(newValue);
    }}
    sx={{ mt: 1 }}
  />
</Box>


          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sell
              sx={{
                color: "action.active",
                mr: 1,
                my: 0.5,
                alignSelf: "center",
              }}
            />
            <TestSearch onLabelChange={handleLabelChange}
              defaultCategories={selectedOption}/>
          </Box>


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

          {selectedEvent?.event?.extendedProps.organiser == user.name && (
            <button className="btn btn-block" onClick={onUpdate}>
              Edit
            </button>
          )}

{errors && <Alert severity="error">{Object.values(errors).map((error, index) => (
      <div key={index}>{error}</div>
    ))}</Alert>}
        </form>
        </Box>
    </Modal>
  );
}

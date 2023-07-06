import {
  faStar, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Description, KeyboardReturn, LocationOn, Schedule, Sell, Title } from "@mui/icons-material";
import {
  Box,
  Chip,
  Modal,
  TextField
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState } from "react";
import ModalImage from "react-modal-image";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";

export default function EventModal() {

  const {selectedEvent, setSelectedEvent, user, getEvents, setSelectedDate, setNotification, 
    openModal, setOpenModal} = useStateContext();
  const [isDisabled, setIsDisabled] = useState(false);

  // Initialize values based on selected event information
  const title = selectedEvent.event.title;
  const description = selectedEvent.event.extendedProps.description;
  const location = selectedEvent.event.extendedProps.location;
  const startTime = selectedEvent.event.extendedProps.startTime;
  const endTime = selectedEvent.event.extendedProps.endTime;
  const image = selectedEvent.event.extendedProps.image;
  const largerImageURL = `data:image/jpeg;base64,${image}`;
  const organiser = selectedEvent.event.extendedProps.organiser;
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(startTime).toLocaleDateString(undefined, optionsDate);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedStartTime = new Date(startTime).toLocaleTimeString(undefined, options);
  const formattedEndTime = new Date(endTime).toLocaleTimeString(undefined, options);
  const [selectedOption, setSelectedOption] = useState(selectedEvent ? selectedEvent.event.extendedProps.categories.map(category => ({
    tag_id: category.tag_id,
    tag_name: category.tag_name,
    tag_colour: category.tag_colour
  })) : []);

  const [isStarred, setIsStarred] = useState(
    selectedEvent.event.extendedProps.isFavourite
  );

  // Handle when user click on star button to add to favourite
  const addToFavorites = () => {
    const favoriteData = {
      userId: user.id,
      eventId: selectedEvent.event.id,
    };

    // POST request to '/favourites' 
    axiosClient
      .post("/favourites", favoriteData)
      .then((response) => {
        setNotification("Event added to favorites");
      })

      // Catch error returned by server
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle when user click on star button to remove to favourite
  const removeFromFavorites = () => {

    // DELETE request to '/favourites' 
    axiosClient
      .delete(`/favourites/${user.id}/${selectedEvent.event.id}`)
      .then((response) => {
        setNotification("Event removed from favorites");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStarClick = () => {
    setIsStarred((prevIsStarred) => !prevIsStarred);
    if (!isStarred) {
      addToFavorites();
    } else {
      removeFromFavorites();
    }

    getEvents();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  }

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
      setOpenModal(false);
      setSelectedEvent(null);
    });
  };

  return (
      <Modal className="event-modal-wrapper"
        open={openModal}
        onClose={(event, reason) => {
          if (reason && reason === 'backdropClick') return;
          handleCloseModal();
        }}
      >

        <Box className="event-modal">
          <div className="modal-header">
            <div className="header-flex-container">
            {user.role === 'Admin' && (
                  <button className="btn-delete" onClick={onDelete} disabled={isDisabled}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              <div className="title-container">
                <h2 className="title">
                  {selectedEvent.event.title} <FontAwesomeIcon
                icon={faStar}
                onClick={handleStarClick}
                color={isStarred ? "#FFC107" : "inherit"}
              />
                </h2>
                <h4>{date}</h4>
                <h6>by: {organiser}</h6>
              </div>
              <div className="btn-container">
                <button
                  className="btn-close"
                  onClick={() => {
                    setOpenModal(false);
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
            {image ? (
              <div className="image-box"
              >
                <ModalImage
                  small={largerImageURL}
                  large={largerImageURL}
                  hideDownload={true}
                />
              </div>
            ) : (
              <div className="image-box">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" alt="No Image" />
              </div>
            )}
          </div>

          <Box className="textfield-box">
            <Title className="textfield-icon"/>
            <TextField className="textfield-disabled" multiline fullWidth label="Title" variant="filled"
              margin="normal" size="small" disabled defaultValue={title}
            />
          </Box>

          <Box className="textfield-box">
            <LocationOn className="textfield-icon"/>
            <TextField className="textfield-disabled" fullWidth multiline label="Location" variant="filled"
              margin="normal" size="small" disabled defaultValue={location}
            />
          </Box>

          <Box className="textfield-box">
            <Description className="textfield-icon" />
            <TextField className="textfield-disabled" fullWidth label="Description" variant="filled"
              margin="normal" size="small" disabled multiline defaultValue={description}
            />
          </Box>

          <Box className="textfield-time-box">
            <Box className="textfield-time">
              <Schedule className="textfield-time-icon" />
              <TextField className="textfield-disabled" fullWidth multiline label="Time" variant="filled"
                margin="normal" size="small" disabled defaultValue={formattedStartTime + " - " + formattedEndTime}
              />
            </Box>
          </Box>

          <Box className="tag-box">
            <Sell className="tag-icon"/>
            {selectedOption.map((option) => (
              <Chip className="tag-chip" key={option.tag_id} label={option.tag_name} style={{ '--chip-background-color': option.tag_colour }}/>
            ))}
          </Box>

        </Box>
      </Modal>
  );
}

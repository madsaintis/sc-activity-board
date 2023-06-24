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
  Autocomplete,
  Box,
  Button,
  Chip,
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
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function EventModal() {

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
        setOpenModal,
        tags
      } = useStateContext();

      const title = selectedEvent.event.title;
      const description = selectedEvent.event.extendedProps.description;
      const location = selectedEvent.event.extendedProps.location;
      const startTime = selectedEvent.event.extendedProps.startTime;
      const endTime = selectedEvent.event.extendedProps.endTime;
      const image = selectedEvent.event.extendedProps.image;
      const largerImageURL = `data:image/jpeg;base64,${image}`;
    
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

      const theme = createTheme({
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                '&.Mui-disabled': {
                  color: 'black',
                },
              },
            },
          },
        },
      });
    
      console.log(selectedEvent.event)
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

  return (
    <ThemeProvider theme={theme}>
    <Modal
      open={openModal}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') return;
        handleCloseModal();
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 0
      }}
    >
      <Box
        sx={{
          width: 'auto', // Customize the width as needed
          maxWidth: '90%',
          bgcolor: 'background.paper',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <button
          className="btn-close"
          onClick={() => {
            setOpenModal(false);
            setSelectedEvent(null);
          }}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>

        <h1 className="title">
          {/* {selectedEvent.event.title} */}
          {title}
          <FontAwesomeIcon
            icon={faStar}
            onClick={handleStarClick}
            color={isStarred ? '#FFC107' : 'inherit'}
          />
        </h1>

        {image ? (
  <div
    style={{
      minWidth: '100%',
      maxHeight: '40vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '10px'
    }}
  >
    <ModalImage
      small={largerImageURL}
      large={largerImageURL}
      hideDownload={true}
    />
  </div>
) : (
  <div
    style={{
      maxWidth: '100%',
      maxHeight: '40vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '10px'
    }}
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      alt="No Image"
      style={{ maxWidth: '100%', maxHeight: '30%' }}
    />
  </div>
)}


        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Title
            sx={{
              color: 'action.active',
              mr: 1,
              my: 0.5,
              alignSelf: 'center'
            }}
          />
          <TextField
  fullWidth
  label="Title"
  variant="filled"
  margin="normal"
  size="small"
  disabled
  defaultValue={title}
  sx={{
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      fontWeight: "bold",
  },
}}
/>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LocationOn
            sx={{
              color: 'action.active',
              mr: 1,
              my: 0.5,
              alignSelf: 'center'
            }}
          />
          <TextField
  fullWidth
  label="Location"
  variant="filled"
  margin="normal"
  size="small"
  disabled
  defaultValue={location}
  sx={{
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      fontWeight: "bold",
  },
}}
/>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Description
            sx={{
              color: 'action.active',
              mr: 1,
              my: 0.5,
              alignSelf: 'center'
            }}
          />
          <TextField
  fullWidth
  label="Description"
  variant="filled"
  margin="normal"
  size="small"
  disabled
  multiline
  defaultValue={description}
  sx={{
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      fontWeight: "bold",
  },
}}
/>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Schedule
              sx={{
                color: 'action.active',
                mr: 0.5,
                my: 0
              }}
            />
            <TextField
  fullWidth
  label="Time"
  variant="filled"
  margin="normal"
  size="small"
  disabled
  defaultValue={formattedStartTime + " - " + formattedEndTime}
  sx={{
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      fontWeight: "bold",
  },
}}
/>
          </Box>
          
        </Box>

        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Sell
            sx={{
              color: 'action.active',
              mr: 0.5,
              my: 0.5,
              alignSelf: 'left'
            }}
          />
          {selectedOption.map((option) => (
          <Chip key={option.tag_id} label={option.tag_name} sx={{mr: 0.5, mb: 2, backgroundColor: option.tag_colour, color: 'white' }}/>
))}
          
        </Box>
          
      </Box>
    </Modal>
    </ThemeProvider>
  );
}

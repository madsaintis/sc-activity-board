import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Alert, Box, Chip, FormControl, InputLabel, ListItemIcon, MenuItem, Select } from "@mui/material";
import { SketchPicker } from "react-color";
import { ChromePicker } from "react-color";
import { useStateContext } from "../../context/ContextProvider";
import { React, useState, useRef, useEffect } from "react";
import { Fragment } from "react";
import axiosClient from "../../axios-client";
import { Sell, Square } from "@mui/icons-material";

// Limit dropdown options to only 6 
const filter = createFilterOptions({
  limit: 6
});

// List of possible colour choices
const tagColourChoice = [
  { label: 'Ultra Violet', value: '#6461A0' },
  { label: 'Violet Blue', value: '#314CB6' },
  { label: 'Steel Blue', value: '#0A81D1' },
  { label: 'Light Coral', value: '#E56B6F' },
  { label: 'Caribbean Current', value: '#006C67' },
  { label: 'Orange Peel', value: '#FF9F1C' },
  { label: 'Indigo', value: '#5F0A87' },
  { label: 'Rose Red', value: '#CA054D' },
  { label: 'Jet', value: '#2C302E' },
  { label: 'Fire Brick', value: '#BB0A21' },
  { label: 'Cosmos', value: '#481620' },
];

export default function TagSearch(props) {
  const { defaultCategories } = props;
  const { tags, getTags } = useStateContext();
  const [value, setValue] = useState([]);
  const [open, toggleOpen] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [TagColor, setTagColor] = useState("");
  const [dialogValue, setDialogValue] = useState({
    tag_name: "",
    tag_colour: "",
  });

  // Close add tag window
  const handleClose = () => {
    setDialogValue({
      tag_name: "",
      tag_colour: "",
    });
    toggleOpen(false);
    setErrors(null);
  };


  // Function to add new tag into database
  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      tag_name: dialogValue.tag_name,
      tag_colour: dialogValue.tag_colour
    }

    // POST request to API '/categories'
    axiosClient.post('/categories', payload)

      .then(({ data }) => {
        getTags();

        // Close add tag modal
        handleClose();
      })

      // Catch exception returned by server
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          setErrors("An error occurred while adding the tag. Please try again.");
          console.log(errors);
        }
      })
  };

  // Automatically fill tag field with selected event tags if there's anyu=
  useEffect(() => {
    setValue(defaultCategories);
  }, []);

  return (
    <Fragment>
      <Autocomplete
        size="small"
        fullWidth
        disablePortal
        margin="dense"
        multiple
        value={value}
        defaultValue={defaultCategories}
        onChange={(event, newValue, reason) => {
          if (
            newValue.length > 0 &&
            newValue[newValue.length - 1].tag_name === "Add New Tag"
          ) {
            // Timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
            });
          } else {
            props.onLabelChange(newValue)
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (filtered.length == 0) {
            filtered.push({
              tag_name: `Add New Tag`,
            });
          }

          return filtered;
        }}

        options={tags}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.tag_name;
        }}
        isOptionEqualToValue={(option, value) => option.tag_id === value.tag_id}
        selectOnFocus
        filterSelectedOptions
        clearOnBlur
        handleHomeEndKeys
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={option.tag_id}
              label={option.tag_name}
              style={{ backgroundColor: option.tag_colour,
              color: 'white' }}
              {...getTagProps({ index })}
            />
          ))
        }
        renderOption={(props, option) => (
          <li {...props}>{option.tag_name}</li>
        )}
        renderInput={(params) => <TextField {...params} label="Tag" />}
      />
      <Dialog disablePortal open={open} onClose={handleClose}>
        <DialogTitle>Add new tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            No suitable tag for your event? Add new one!
          </DialogContentText>
          <Box display="flex" alignItems="center">
            <TextField
              autoFocus
              margin="dense"
              variant="standard"
              size="small"
              fullWidth
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  tag_name: event.target.value,
                })
              }
              label="Tag name"
            />
            <TextField
              select
              margin="dense"
              variant="standard"
              label="Tag colour"
              size="small"
              value={dialogValue.tag_colour}
              sx={{ ml: 1 }}
              fullWidth
              filterSelectedOptions
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  tag_colour: event.target.value,
                })
              }
            >
              {tagColourChoice.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                {dialogValue.tag_colour !== color.value && (
                  
                  <ListItemIcon>
                    <Square style={{ color: color.value }} />
                  </ListItemIcon>
                )}
                {color.label}
              </MenuItem>
              ))}
            </TextField>
          </Box>
          {dialogValue.tag_name && dialogValue.tag_colour && (
  <>
    
    <DialogContentText sx={{my: 2}}>
      Preview
    </DialogContentText>
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
          <Chip
      label={dialogValue.tag_name}
      sx={{
        backgroundColor: dialogValue.tag_colour,
        color: 'white',
      }}
    />
          
        </Box>
  </>
)}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} form="addFilmForm">
            Add
          </Button>
          
        </DialogActions>
        {errors && (
  <Alert severity="error">
    {Object.values(errors).join(' ')}
  </Alert>
)}

        

      </Dialog>
    </Fragment>
  );
}


import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Alert, Box } from "@mui/material";
import { SketchPicker } from "react-color";
import { ChromePicker } from "react-color";
import { useStateContext } from "../../context/ContextProvider";
import { React, useState, useRef, useEffect } from "react";
import { Fragment } from "react";
import axiosClient from "../../axios-client";

const filter = createFilterOptions({
   limit: 6
});

export default function TestSearch(props) {
  const { defaultCategories } = props;
  const { tags, getTags } = useStateContext();
  const [value, setValue] = useState([]);
  const [open, toggleOpen] = useState(false);
  const [errors, setErrors] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const [showPicker, setShowPicker] = useState(false);
  const tagNameRef = useRef();
  const tagColorRef = useRef();

  const handleClose = () => {
    setDialogValue({
      tag_name: "",
      tag_colour: "",
    });
    toggleOpen(false);
  };
  console.log(value)
  const [dialogValue, setDialogValue] = useState({
    tag_name: "",
    tag_colour: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(null);

    const payload = {
      tag_name: tagNameRef.current.value
    }

    axiosClient.post('/categories', payload)

      // Set user and access token if register process completes
      .then(({data}) => {
        
        getTags();
        handleClose();
      })
      // catch error if registration not successful
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          setErrors("An error occurred while adding the tag. Please try again.");
        }
      })

    
  };

  useEffect(() => {
    setValue(defaultCategories);
  }, []);

  return (
    <Fragment>
      <Autocomplete
        size="small"
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
          console.log(options)
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
        renderOption={(props, option) => (
          <li {...props}>{option.tag_name}</li>
        )}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Tag" />}
      />
      <Dialog disablePortal open={open} onClose={handleClose}>
        <DialogTitle>Add new tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            No suitable tag for your event? Add new one!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            variant="outlined"
            id="name"
            inputRef={tagNameRef}
            onChange={(event) =>
              setDialogValue({
                ...dialogValue,
                title: event.target.value,
              })
            }
            label="Tag name"
            type="text"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} form="addFilmForm">
            Add
          </Button>
        </DialogActions>
        {errors && <Alert severity="error">{Object.values(errors).map((error, index) => (
      <div key={index}>{error}</div>
    ))}</Alert>}
        
      </Dialog>
    </Fragment>
  );
}


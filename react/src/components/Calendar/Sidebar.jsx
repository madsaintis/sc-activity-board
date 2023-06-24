import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

export default function Sidebar() {
  const { setEvents, initialEventsData, categories } = useStateContext();
  const [category, setCategory] = useState([]);

  const handleChange = (e) => {
    if (e.target.checked) {
      setCategory([...category, e.target.value]);
    } else {
      setCategory(category.filter((id) => id !== e.target.value));
    }
  };

  useEffect(() => {
    if (category.length === 0) {
      setEvents(initialEventsData);
    } else {
      setEvents(
        initialEventsData.filter((event) =>
          category.every((categoryId) =>
            event.categories.some(
              (categoryObj) => categoryId === categoryObj.tag_id.toString()
            )
          )
        )
      );
    }
  }, [category]);

  return (
    <div className="Sidebar">
      <FormControl>
        <FormGroup>
          {categories.map((event) => (
            <FormControlLabel
              key={event.value}
              control={<Checkbox onChange={handleChange} />}
              label={event.label}
              value={event.value}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
}

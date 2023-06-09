// EventFunctions.jsx

import axiosClient from "../../axios-client";

export const handleImageUpload = (event, setChanged, setImage, setPreviewURL) => {
  const file = event.target.files[0];
  setChanged(true);
  setImage(file);
  const reader = new FileReader();

  reader.onload = () => {
    setPreviewURL(reader.result);
  };

  reader.readAsDataURL(file);
};

export const handleImageRemove = (setChanged, setImage, setPreviewURL) => {
  setChanged(true);
  setImage(null);
  setPreviewURL(null);
};

export const handleLabelChange = (selectedOption, setLabel) => {
  setLabel(selectedOption);
};

export const handleVisibilityChange = (event, setIsPublic) => {
  const checkboxId = event.target.id;
  if (checkboxId === "privateCheckbox") {
    setIsPublic(false);
  } else if (checkboxId === "publicCheckbox") {
    setIsPublic(true);
  }
};

export const handleStarClick = (setIsStarred, isStarred) => {
  setIsStarred((prevIsStarred) => !prevIsStarred);
  console.log(isStarred);
};

export const onSubmit = (
  event,
  titleRef,
  LocationRef,
  descriptionRef,
  startTimeRef,
  endTimeRef,
  selectedDate,
  user,
  isPublic,
  image,
  label,
  setNotification,
  getEvents,
  setShowEventModal
) => {
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

export const onUpdate = (
  event,
  titleRef,
  LocationRef,
  descriptionRef,
  startTimeRef,
  endTimeRef,
  selectedDate,
  user,
  isPublic,
  image,
  label,
  changed,
  selectedEvent,
  setNotification,
  getEvents,
  setShowEventModal
) => {
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

export const onDelete = (
  event,
  axiosClient,
  selectedEvent,
  getEvents,
  setNotification,
  setShowEventModal,
  setSelectedEvent
) => {
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

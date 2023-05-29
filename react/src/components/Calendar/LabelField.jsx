import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useStateContext } from '../../context/ContextProvider';

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
  }),
  multiValue: (provided, { data }) => ({
    ...provided,
    backgroundColor: data.color || 'white',
  }),
  multiValueRemove: (provided, { data }) => ({
    ...provided,
    backgroundColor: data.color || 'white',
    ':hover': {
      backgroundColor: 'darkorange',
    },
  }),
};

export default function LabelField(props) {
  const {defaultCategories} = props;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const {categories} = useStateContext();

  useEffect(() => {
    setSelectedOptions(defaultCategories);
  }, []); 

  const getSelectedOptions = () => {
    if (!selectedOptions) {
      return [];
    }
    return categories.filter((option) => selectedOptions.some((selectedOption) => selectedOption.value === option.value));
  };

  const handleLabel = (selectedOption) => {
    props.onLabelChange(selectedOption);
    setSelectedOptions(selectedOption);
  };

  return (
    <Select
      isMulti
      options={categories}
      styles={customStyles}
      value={getSelectedOptions()}
      onChange={handleLabel}
    />
  );
}
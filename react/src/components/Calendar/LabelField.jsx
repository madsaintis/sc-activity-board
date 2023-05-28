//ALMOST WORK

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useStateContext } from '../../context/ContextProvider';

const options = [
  { value: '1', label: 'Option 1', color: 'red' },
  { value: '2', label: 'Option 2', color: 'blue' },
  { value: '3', label: 'Option 3', color: 'green' },
];

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
  const { defaultCategories, onLabelChange } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [selectedOptions, setSelectedOptions] = useState([{ value: '1', label: 'Option 1' }]);
  
  useEffect(() => {
    setSelectedOptions(defaultCategories);
  }, []); 

  const getSelectedOptions = () => {
    if (!selectedOptions) {
      return [];
    }
    return options.filter((option) => selectedOptions.some((selectedOption) => selectedOption.value === option.value));
  };

  const handleLabel = (selectedOption) => {
    props.onLabelChange(selectedOption);
    setSelectedOptions(selectedOption);
  };

  return (
    <Select
      isMulti
      options={options}
      styles={customStyles}
      value={getSelectedOptions()}
      onChange={handleLabel}
    />
  );
}


//ALMOST WORK

// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';

// const options = [
//   { value: '1', label: 'Option 1', color: 'red' },
//   { value: '2', label: 'Option 2', color: 'blue' },
//   { value: '3', label: 'Option 3', color: 'green' },
// ];

// const customStyles = {
//   control: (provided) => ({
//     ...provided,
//     backgroundColor: 'white',
//   }),
//   multiValue: (provided, { data }) => ({
//     ...provided,
//     backgroundColor: data.color || 'white',
//   }),
//   multiValueRemove: (provided, { data }) => ({
//     ...provided,
//     backgroundColor: data.color || 'white',
//     ':hover': {
//       backgroundColor: 'darkorange',
//     },
//   }),
// };

// export default function LabelField(props) {
//   const { defaultCategories, onLabelChange } = props;
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   useEffect(() => {
//     setSelectedOptions(defaultCategories);
//   }, [defaultCategories]);

//   const getSelectedOptions = () => {
//     if (!selectedOptions) {
//       return [];
//     }
//     return options.filter((option) => selectedOptions.some((selectedOption) => selectedOption.value === option.value));
//   };

//   const handleLabel = (selectedOption) => {
//     setSelectedOptions(selectedOption);
//     onLabelChange(selectedOption);
//   };

//   return (
//     <Select
//       isMulti
//       options={options}
//       styles={customStyles}
//       value={getSelectedOptions()}
//       onChange={handleLabel}
//     />
//   );
// }



// DONT DELETE WORKING ONE

// import React, { useState } from 'react';
// import Select from 'react-select';

// const options = [
//   { value: '1', label: 'Option 1', color: 'red' },
//   { value: '2', label: 'Option 2', color: 'blue' },
//   { value: '3', label: 'Option 3', color: 'green'},
// ];

// const customStyles = {
//   control: (provided) => ({
//     ...provided,
//     backgroundColor: 'white',
//   }),
//   multiValue: (provided, {data}) => ({
//     ...provided,
//     backgroundColor: data.color || 'white',
//   }),
//   multiValueRemove: (provided, {data}) => ({
//     ...provided,
//     backgroundColor: data.color || 'white',
//     ':hover': {
//       backgroundColor: 'darkorange',
//     },
//   }),
// };



// export default function LabelField (props) {
//   const [selectedOptions, setSelectedOptions] = React.useState([]);

//   const handleLabel = (selectedOption) => {
//     props.onLabelChange(selectedOption);
//     setSelectedOptions(selectedOption);
//   };

//   return (
//     <Select
//       isMulti
//       options={options}
//       styles={customStyles}
//       value={selectedOptions}
//       onChange={handleLabel}
//     />
//   );
// };
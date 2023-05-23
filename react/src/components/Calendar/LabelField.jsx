// import {React, useState} from 'react'

// export default function LabelField() {

//     const [selectedOptions, setSelectedOptions] = useState([]);
//   const [availableOptions, setAvailableOptions] = useState([
//     "Option 1",
//     "Option 2",
//     "Option 3"
//     // Add more options here
//   ]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(true);

//   const handleDropdownChange = (e) => {
//     const selectedOption = e.target.value;
//     setSelectedOptions([...selectedOptions, selectedOption]);
//     setAvailableOptions(availableOptions.filter((option) => option !== selectedOption));
//     setIsDropdownOpen(false);
//   };

//   const handleRemoveOption = (option) => {
//     setSelectedOptions(selectedOptions.filter((item) => item !== option));
//     setAvailableOptions([...availableOptions, option]);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="dropdown-field">
//   <div className="selected-options">
//     {selectedOptions.map((option) => (
//       <div key={option} className="selected-option">
//         {option}
//         <button onClick={() => handleRemoveOption(option)}>X</button>
//       </div>
//     ))}
//   </div>
//   <div className="dropdown-container">
//     <select value="" onChange={handleDropdownChange} className="dropdown-select">
//       <option value="" disabled hidden>Select an option</option>
//       {availableOptions.map((option) => (
//         <option key={option} value={option}>{option}</option>
//       ))}
//     </select>
//   </div>
// </div>
//   );
// };

// import React, { useState } from 'react';
// import { FaChevronDown } from 'react-icons/fa';

// export default function LabelField() {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleToggleOptions = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="label-field" onClick={handleToggleOptions}>
//       <div className="content">Your content goes here</div>
//       <FaChevronDown className="arrow-icon" />
//       {isOpen && (
//         <ul className="label-list">
//           <li>Option 1</li>
//           <li>Option 2</li>
//           <li>Option 3</li>
//         </ul>
//       )}
//     </div>
//   );
// };

import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: '1', label: 'Option 1', color: 'red' },
  { value: '2', label: 'Option 2', color: 'blue' },
  { value: '3', label: 'Option 3', color: 'green'},
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
  }),
  multiValue: (provided, {data}) => ({
    ...provided,
    backgroundColor: data.color || 'white',
  }),
  multiValueRemove: (provided, {data}) => ({
    ...provided,
    backgroundColor: data.color || 'white',
    ':hover': {
      backgroundColor: 'darkorange',
    },
  }),
};



export default function LabelField (props) {
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const handleLabel = (selectedOption) => {
    props.onLabelChange(selectedOption);
    setSelectedOptions(selectedOption);
  };

  return (
    <Select
      isMulti
      options={options}
      styles={customStyles}
      value={selectedOptions}
      onChange={handleLabel}
    />
  );
};

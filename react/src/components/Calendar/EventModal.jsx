import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useState } from 'react'
import { faEllipsisV, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useStateContext } from '../../context/ContextProvider'
import { useRef } from 'react';

const labelsClasses = [
    "indigo",
    "gray",
    "green",
    "blue",
    "red",
    "purple",
  ];



export default function EventModal() {

    const titleRef = useRef();
const descriptionRef = useRef();
const {setShowEventModal, selectedEvent, setSelectedEvent} = useStateContext();

const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.event.title : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.event.description : ""
  );

  const onSubmit = (event) => {
    event.preventDefault()
    console.log(titleRef.current.value)
    console.log(descriptionRef.current.value)
  }
//   return (
//     <div className='EventModal'>
//         <form className='EventCreationScreen'>
//             <header className='ModalHeader'>
//                 <span>
//                     <FontAwesomeIcon icon={faEllipsisV} />
//                 </span>
//                 <button onClick={ function(){
//                      setShowEventModal(false);
//                      setSelectedEvent(null);
//                 }
//                    }>
//                     <FontAwesomeIcon icon={faTimesCircle} />
//                 </button>
//             </header>
//             <div>
//             {
//                 title
//             }
//             </div>
//         </form>
//     </div>
//   )

return (
    <div className='EventModal animated fadeInDown'>
      <div className='EventCreationScreen'>
        <form onSubmit={onSubmit}>
        <button className="btn-close" onClick={ function(){
                     setShowEventModal(false);
                    setSelectedEvent(null);
                    }}>
                   <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          <h1 className='title'>
            Create Event
          </h1>
          
          <input 
            ref={titleRef} 
            placeholder='Title' 
            defaultValue={title}
            onChange={(e) => setDescription(e.target.value)} 
            />

          <input ref={descriptionRef} placeholder='Description' 
          defaultValue={title}
            onChange={(e) => setDescription(e.target.value)} 
            />
          <button className='btn btn-block'>Create</button>
          
          {/* { errors && <div className='alert'>
            {  Object.keys(errors).map(key => (
              <p>{errors[key][0]}</p>
            )
            )}
          </div>
          } */}
        </form>
      </div>
      
    </div>
  )
}

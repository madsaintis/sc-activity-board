import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { faEllipsisV, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useStateContext } from '../../context/ContextProvider'

export default function EventModal() {
  const {setShowEventModal} = useStateContext();
  return (
    <div className='EventModal'>
        <form className='EventCreationScreen'>
            <header className='ModalHeader'>
                <span>
                    <FontAwesomeIcon icon={faEllipsisV} />
                </span>
                <button onClick={() => setShowEventModal(false)}>
                    <FontAwesomeIcon icon={faTimesCircle} />
                </button>
            </header>
            HAI
        </form>
    </div>
  )
}
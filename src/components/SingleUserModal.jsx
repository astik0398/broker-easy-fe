import React from 'react'
import '../styles/SingleUserModal.css'

function SingleUserModal({handlePhoneCall, handleWhatsappCall, singleUserDetail, handleCloseModal}) {
  return (
    <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-button" onClick={handleCloseModal}>
        &times;
      </button>
      <div>
      <h3>{singleUserDetail["Name"]}</h3>
      <h3>{singleUserDetail["Address"]}</h3>
      <h3>{singleUserDetail["Phone Number"]}</h3>
      </div>

      <div className='call-div'>
        <button onClick={() => handlePhoneCall(singleUserDetail["Phone Number"])}>Call</button>
        <button onClick={() => handleWhatsappCall(singleUserDetail["Phone Number"])}>Whatsapp</button>
      </div>
    </div>
  </div>
  )
}

export default SingleUserModal
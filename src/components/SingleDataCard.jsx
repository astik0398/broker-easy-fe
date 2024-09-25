import React, { useState } from 'react'
import '../styles/SingleDataCard.css'
import { useSwipeable } from 'react-swipeable'

function SingleDataCard({data, handleWhatsappCall, handlePhoneCall ,handleTwilioCall}) {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [animationClass, setAnimationClass] = useState('');

    const handlers = useSwipeable({
      onSwipedLeft: () => {
          if (currentIndex < data.length - 1) {
              setAnimationClass('swipe-left');
              setTimeout(() => {
                  setCurrentIndex(prev => prev + 1);
                  setAnimationClass('');
              }, 300);
          } else {
              alert("You are already on the last card!");
          }
      },
      onSwipedRight: () => {
          if (currentIndex > 0) {
              setAnimationClass('swipe-right');
              setTimeout(() => {
                  setCurrentIndex(prev => prev - 1);
                  setAnimationClass('');
              }, 300); // Match this duration with your CSS animation duration
          } else {
              alert("You are already on the first card!");
          }
      },
  });

      const currentItem = data[currentIndex]

  return (
    <div {...handlers} className={`single-card ${animationClass}`}>
      <h2>Name: {currentItem['Name']}</h2>
      <h2>Address: {currentItem['Address']}</h2>
      <h2>Phone Number: {currentItem['Phone Number']}</h2>
      <div className='icons-container'>
        <div className='icon-div'>
        <button onClick={()=> handleTwilioCall(currentItem['Phone Number'])} id='twilio-button' role="button">
            Call from twilio
        </button>
        </div>
        <div className='icon-div'>
          <button onClick={()=> handlePhoneCall(currentItem['Phone Number'])} id='call-button'>Make a Call</button>
        </div>
        <div className='icon-div'>
          <button onClick={()=> handleWhatsappCall(currentItem['Phone Number'])} id='whatsapp-button'>Whatsapp</button>
        </div>
      </div>
    </div>
  )
}


export default SingleDataCard
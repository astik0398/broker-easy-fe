import React, { useState } from 'react'
import '../styles/SingleDataCard.css'
import mobileIcon from '../assets/mobileIcon.svg'
import phoneIcon from '../assets/phoneIcon.svg'
import whatsappIcon from '../assets/whatsappIcon.png'
import { useSwipeable } from 'react-swipeable'

function SingleDataCard({data}) {

    const [currentIndex, setCurrentIndex] = useState(0)

    const handlers = useSwipeable({
        onSwipedLeft: () => {
          if (currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            alert("You are already on the last card!");
          }
        },
        onSwipedRight: () => {
          if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          } else {
            alert("You are already on the first card!");
          }
        },
      });

      const currentItem = data[currentIndex]
    //   console.log(currentItem);
      

  return (
    <div {...handlers} className="single-card">
      <h2>Name: {currentItem['Name']}</h2>
      <h2>Address: {currentItem['Address']}</h2>
      <h2>Phone Number: {currentItem['Phone Number']}</h2>
      <div className='icons-container'>
        <div className='icon-div'>
          <button>Call from Twilio</button>
        </div>
        <div className='icon-div'>
          <button>Make a Call</button>
        </div>
        <div className='icon-div'>
          <button>Whatsapp</button>
        </div>
      </div>
    </div>
  )
}

export default SingleDataCard
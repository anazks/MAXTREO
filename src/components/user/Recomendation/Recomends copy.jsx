import React from 'react'
import './Rec.css'
import Recoments from '../../../Images/Recoments.png'
import { IoArrowForwardCircleSharp } from 'react-icons/io5'
import NavBar from '../NavBar/NavBar'
function Recomends() {
  return (
<>

<div className='recomends'>
  <div className="top-box">
    <div className="leftSide">
      <p className='tokyo'>NeoTokyo</p>
      <span className='gaming'>Gaming Setups</span>
    </div>
    <div className="rightSide">
      <span>Our Recommendations</span>
    </div>
  </div>
  

  <div className="middle-box">
            <button className="team-button">
                        <IoArrowForwardCircleSharp className='iconsbtn-team' />
                        <span className='Team' style={{ color: 'WHITE' }} >Shop Now</span>
            </button>
  </div>
  
  <div className="bottom-box">
    <div className="rating">
      <div><p className='rateNumber'>5.0</p></div>
      <div>
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
        <p className='review'>121 Reviews</p>
      </div>
    </div>
    <div className="quality">
      <p>Uncompromising Quality</p>
    </div>
  </div>
  
  <img src={Recoments} alt="Recommendation Background" />
</div>
</>

  )
}

export default Recomends

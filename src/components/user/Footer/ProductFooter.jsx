import React from 'react'
import './productFooter.css'
import footerLogo from '../../../Images/Group 721.png'
function ProductFooter() {
  return (
    <div className='footerProduct'>
        <div className="leftFooter">
                <div className="top">
                    <p><span>SUBSCRIBE</span> FOR A SEAMLESS EXPERIENCE</p>
                    <div className='imgContainer'><img src={footerLogo} alt="" /> <p>Priority One by Neo Tokyo</p> <p className='bottom-text'>For the Ultimate Experience</p></div>
                </div>
                <div className="bottomm">
                      
                </div>
        </div>
        <div className="rightFooter">
                <p>+91 - 7920938981</p>
                <p>support@neotokyo.in</p>
        </div>
    </div>
  )
}

export default ProductFooter

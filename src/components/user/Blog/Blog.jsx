import React from 'react'
import './Blog.css'
import blog from '../../../Images/blog.png'
function Blog() {
  return (
  <div className="blog-containers">
   <div className="blog-left">
   <div className="blog-header">
        <div className="textLogo">
         <b> NT </b><br /><b>KO</b>
        </div>
        <div className="blog-heading">
            <span>Priority One by Neo Tokyo</span>
            <div className="blog-subHeading">
                <p></p>For the One Who want the best we offer
            </div>
        </div>
    </div>
        <div className="blog-SubMainHeading">
            <span>Hellow Julian,Search  our Blogs</span>
        </div>
   <div className="blog-details">
      <ul>
        <li>New Tech News</li>
        <li>Tech Releases</li>
        <li>Gadgets</li>
        <li>E Sports Segments</li>
        <li>and Much more</li>
      </ul>
   </div>
   <div className="blog-SearchBox">
        <h4>Found What you are Looking For</h4>
        <div className="searchBox-blog">
            
          <div className="search-input">
                 <button className="search-button">Search</button>    
          </div>
        </div>


   </div>
   </div>
   <div className="blog-right">
        <img src={blog} alt="" />
   </div>
  </div>

  )
}

export default Blog

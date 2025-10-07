import React from "react";
import PriorityOne from "./PriorityOne";
import NavBar from "../NavBar/NavBar"
import Footer from "../Footer/Footer";

function TeamNeo() {
  return (
    <div>
        <NavBar/>
        <div className="container mx-auto mt-20 mb-20 w-full max-w-[95%]" 
        >
<PriorityOne/>
        </div>
        
        <Footer/>
        
    </div>
  )
}

export default TeamNeo;

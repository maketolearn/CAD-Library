import React, {useState} from 'react';
import '../Styles/CategoryBanner.css';
// import svg from "../../public/ico.svg";import React from "react";
import { NavLink } from 'react-router-dom';


const CategoryBanner= ({subject}) => {   

    let id = subject.toLowerCase() + "-banner";

    const [hamburger, setHamburger] = useState(false);

    function menuOn(){
        setHamburger(true);
        // console.log(hamburger);
    }

    function menuOff(){
        setHamburger(false);
        // console.log(hamburger);
    }

    const scienceID = (subject === "Science" ? "science-active" : "");
    const techID = (subject === "Technology" ? "technology-active" : "");
    const engineeringID = (subject === "Engineering" ? "engineering-active" : "");
    const mathID = (subject === "Mathematics" ? "mathematics-active" : "");

    //Accomodate for Technology to Design change
    if (subject == "Technology"){
        id = "design-banner";
        subject = "Design";
    }
    
    return (
        <div>
            <container id={id}>
                
                <div/>

                <div class="subject"> {subject} </div>

                <div id="iconPlaceholder"/>

                <a href="#!" id="icon" onClick={menuOn}/>

                <ul className={hamburger ? 'dropdown-menu on' : 'dropdown-menu off'} 
                onMouseLeave={menuOff} 
                onClick={menuOff} 
                aria-expanded="false">
                    <li class="menu-item menu-item-home" >
                        <NavLink to="/" >Home</NavLink>
                    </li>
                    <li class="menu-item menu-item-science" >
                        <NavLink to="/science" >Science</NavLink>
                    </li>
                    <li class="menu-item menu-item-technology">
                        <NavLink to="/technology" >Design</NavLink>
                    </li>
                    <li class="menu-item menu-item-engineering" >
                        <NavLink to="/engineering" >Engineering</NavLink>
                    </li>
                    <li class="menu-item menu-item-mathematics" >
                        <NavLink to="/mathematics" >Mathematics</NavLink>
                    </li>
                    <li class="menu-item menu-item-forum" >
                        <a href="https://forum.cadlibrary.org/">Forum</a>
                    </li>
                </ul>

            </container> 
        </div>
    
    )
}

export default CategoryBanner;
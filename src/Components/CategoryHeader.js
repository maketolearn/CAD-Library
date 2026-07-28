import React from "react";
import { NavLink } from 'react-router-dom';
import '../Styles/CategoryHeader.css';

const CategoryHeader = ({subject}) => {
    
    const scienceID = (subject === "Science" ? "science-active" : "");
    const techID = (subject === "Technology" ? "technology-active" : "");
    const engineeringID = (subject === "Engineering" ? "engineering-active" : "");
    const mathID = (subject === "Mathematics" ? "mathematics-active" : "");


    return (
        <div id="page">
            <div id="cats-header">
                <ul class="cats-menu" aria-expanded="false">
                    <li class="cat-item cat-item-home cat-item-9" >
                        <NavLink to="/" style={({ isActive }) => ({
                            background: isActive ? '#c1c1c1' : '',
                            textDecoration: "none",
                            padding: isActive ? '10px 47px' : '5px 10px',
                        })}>Home</NavLink>
                    </li>
                    <li class="cat-item cat-item-science cat-item-9" >
                        <NavLink id={scienceID} to="/science" style={({ isActive }) => ({
                            background: isActive ? '#c1c1c1' : '',
                            textDecoration: "none",
                            padding: isActive ? '10px 37px' : '5px 10px',
                        })}>Science</NavLink>
                    </li>
                    <li class="cat-item cat-item-technology cat-item-9">
                        <NavLink id={techID} to="/technology" style={({ isActive }) => ({
                            background: isActive ? '#c1c1c1' : '',
                            textDecoration: "none",
                            padding: isActive ? '10px 21px' : '5px 10px',
                        })}>Design</NavLink>
                    </li>
                    <li class="cat-item cat-item-engineering cat-item-9" >
                        <NavLink id={engineeringID} to="/engineering" style={({ isActive }) => ({
                            background: isActive ? '#c1c1c1' : '',
                            textDecoration: "none",
                            padding: isActive ? '10px 20px' : '5px 10px',
                        })}>Engineering</NavLink>
                    </li>
                    <li class="cat-item cat-item-mathematics cat-item-9" >
                        <NavLink id={mathID} to="/mathematics" style={({ isActive }) => ({
                            background: isActive ? '#c1c1c1' : '',
                            textDecoration: "none",
                            padding: isActive ? '10px 18px' : '5px 10px',
                        })}>Mathematics</NavLink>
                    </li>
                    <li class="cat-item cat-item-forum cat-item-9" >
                        {/* <NavLink to="/forum" style={({ isActive }) => ({
                            background: isActive ? '#c1c1c1' : '',
                            textDecoration: "none",
                            padding: isActive ? '10px 43px' : '5px 10px',
                        })}>Forum</NavLink> */}
                        <a href="https://forum.cadlibrary.org/">Forum</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CategoryHeader;
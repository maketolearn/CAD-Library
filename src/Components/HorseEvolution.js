import React, {useState, useEffect} from "react";
import "../Styles/Object.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainHeader from './MainHeader';
import CategoryHeader from './CategoryHeader';
import parser from 'html-react-parser';
import '../Styles/Page.css';


const HorseEvolution = () => {
    const { doi } = useParams();

    const [imgUrl, setImgUrl] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [introSentence, setIntroSentence] = useState("");
    const [developerName, setDeveloperName] = useState("");
    const [developerLink, setDeveloperLink] = useState("");
    const [instructionalResourcesUrl, setInstructionalResourcesUrl] = useState(""); //download url for the instructional resources zip file
    const [fabricationGuideUrl, setFabricationGuideUrl] = useState(""); //download url for the fabrication guide zip file
    const [subject, setSubject] = useState("");
    const [gradeLevels, setGradeLevels] = useState("");
    const [forumLink, setForumLink] = useState("");

    //citation fields
    const [authorsFormmated, setAuthorsFormatted] = useState("");
    const [year, setYear] = useState("");
    const [depositDate, setDepositDate] = useState("");
    
    useEffect(() => {
        setImgUrl("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQI543PLIQIc4To-7vEaHXFBFHwChFBBbEOpQCI1saa02QuDiWz");
        setTitle("Horse Evolution");
        setIntroSentence("This dataset of fossil horse teeth published on <a href='https://www.morphosource.org/'> Morphosource </a> has been selected by Florida Museum scientists to help K12 students understand concepts related to horse evolution and climate change. ")
        setDesc("Three lessons have been developed in collaboration with science teachers that can be used with the 3D files provided.");
        setInstructionalResourcesUrl("http://www.paleoteach.org/chewing-on-change-exploring-the-evolution-of-horses-in-response-to-climate-change/");
        setDeveloperName("Center for Precollegiate Education and Training, University of Florida");
        setDeveloperLink("https://www.cpet.ufl.edu/");
        setFabricationGuideUrl("https://www.morphosource.org/projects/00000C144");
        setSubject("Science -  Biology");
        setGradeLevels("10, 11, 12")
        setForumLink("https://forum.cadlibrary.org/t/horse-evolution/24");
    }, [])

    const formatAuthors = (author) => {
        //two authors
        if(author.includes("&")){
            let authors = [];
            authors = author.split(" & ");
            let authorLastName1 = authors[0].substring(0, authors[0].indexOf(","));
            let authorFirstInitial1 = authors[0].charAt(authorLastName1.length + 2);
            let authorLastName2 = authors[1].substring(0, authors[1].indexOf(","));
            let authorFirstInitial2 = authors[1].charAt(authorLastName2.length + 2);
            setAuthorsFormatted(authorLastName1 + ", " + authorFirstInitial1 + ". & " + authorLastName2 + ", " + authorFirstInitial2 + ".")
        }
        else {
            let authorLastName = author.substring(0, author.indexOf(","));
            let authorFirstInitial = author.charAt(authorLastName.length + 2);
            setAuthorsFormatted(authorLastName + ", " + authorFirstInitial + ".");
        }
    }

    const formatDepositDate = (depositDate) => {
        let date = depositDate.split("-");
        let year = date[0];
        let month = date[1];
        if(date[1].includes("0")){
            month = month[1];
        }
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        month = months[month - 1]
        let day = date[2];
        if(day[0] === "0"){
            day = day[1];
        }
        setDepositDate(month + " " + day + ", " + year);

    }

    return (
        <div>
            <body>
                <div class="site">
                    <MainHeader subject="none"></MainHeader>
                    <CategoryHeader></CategoryHeader>
                    <div id="page">
                        <h2>{title}</h2>
                        <br></br>
                        <div id="details">

                            <div>
                                <img id="img-single" src={imgUrl} alt="Object Thumbnail Not Found" align="left"></img>
                                {parser(introSentence)}
                                <br></br>
                                <br></br>

                                <h4> Big Idea </h4>
                                {desc}
                            </div>
                            
                            <div id="box">
                                <b>Developer</b>
                                <br></br>
                                <p class="detail"><a href={developerLink} target="_blank">{developerName}</a></p>
                                
                                <b>Subject</b>
                                <br></br>
                                <p class="detail">{subject}</p>
                              
                                <b>Grade Levels</b>
                                <p class="detail"> {gradeLevels} </p>
                                
                                <b>Download</b>
                                <ul>
                                    <li>
                                        <a href={instructionalResourcesUrl}>Instructional Resources</a>
                                    </li>
                                    <li> 
                                        <a href={fabricationGuideUrl}>CAD Models </a>
                                    </li>
                                </ul>

                                <a class="detail" href={forumLink}>Discuss</a>
                            </div>
                        </div>
                        
                        <div>
                            <h4> Sample Learning Goals </h4>
                                <ul>
                                    <li> Exploring the Geologic Time Scale via Changes in Fossilized Horse Teeth in Response to Co-evolution of Plants  </li>
                                    <li> Examining Intraspecies Variation and Changes in a Single Horse Population </li>
                                    <li> Proposing Changes to Orthogenesis and Communicating Evolution in Museums </li>
                                </ul>
                                
                                
                            <h4> Citation </h4>
                                <p> Broo, J. and Mahoney, J. (2015). Horse Evolution [Educational Project]. Morphosource. Published March 12, 2015. https://www.morphosource.org/projects/00000C144 </p>

                        </div>
                    </div>
                </div>
            </body>
        </div>

    )
}

export default HorseEvolution;
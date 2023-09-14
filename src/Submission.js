import React, {useState, useRef} from 'react';
import MainHeader from './Components/MainHeader';
import CategoryHeader from './Components/CategoryHeader';
import CategoryBanner from './Components/CategoryBanner';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './Styles/Page.css';
import './Styles/Submission.css'

const Submission = () => {

    const navigate = useNavigate();
    const form = useRef();
  
    const [searchTerm, setSearchTerm] = useState("");
    const [searchObjects, setSearchObjects] = useState([]);
    const [subject, setSubject] = useState("Library");

    const [showMessage, setShowMessage] = useState(false);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      setSearchObjects([]);
      navigate(`/browse`, {state: searchTerm});
    }

    const sendEmail = (e) => {
      e.preventDefault();
      
      emailjs.sendForm('service_41f3fg5', 'template_nprqnh3', form.current, 'MIqeZxkpcd7inecb4')
      .then((result) => {
          setShowMessage(true);
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
    }
  
    return (
      <div>
        <body>
          <div class="site">
            <MainHeader input={searchTerm}  setInput={setSearchTerm} handleSubmit={handleSubmit} subject={subject} showFilter={false}></MainHeader>
            <CategoryHeader></CategoryHeader>
            <CategoryBanner subject="Submissions"></CategoryBanner>
  
            <div id="page">
              <p>Publish your educational object in the CAD Library:</p>
              <ul>
                <li> Do you use physical objects in your teaching?  Would you be interested in publishing an educational object that you have developed in the <em>CAD Library</em>? </li>
                <li>Do you have other questions about the <em>CAD Library</em> or the submission process?</li>
              </ul>
              <form ref={form} onSubmit={sendEmail}>

                <p>To inquire, contact one of the following CAD Library curators:</p>
                <ul>
                  <input type="radio" name="object_subject" value="science" required></input><label id="checkbox-label">Science Curators&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Ellis & Sumreen Asim</label>
                  <br></br>
                  <input type="radio" name="object_subject" value="technology"></input><label id="checkbox-label">Technology Curator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Elizabeth Whitewolf</label>
                  <br></br>
                  <input type="radio" name="object_subject" value="engineering"></input><label id="checkbox-label">Engineering Curator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ryan Novitski</label>
                  <br></br>
                  <input type="radio" name="object_subject" value="mathematics"></input><label id="checkbox-label">Mathematics Curator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Steven Greenstein </label>
                </ul>

                <p>Provide your name, e-mail address, and a short description of your interest.</p>
                <input type="hidden" name="to_name" value="Rishi"></input>
                
                <label>Name</label><br></br>
                <input type="text" name="from_name" required></input><br></br><br></br>

                <label>Email</label><br></br>
                <input type="email" name="from_email" required></input><br></br><br></br>

                <label>Brief description of your interest or query</label><br></br>
                <textarea name="message" rows="10" cols="100" required></textarea><br></br><br></br>

                {/* <div class="g-recaptcha" data-sitekey={process.env.REACT_APP_SITE_KEY}></div><br></br> */}

                <input type="submit" value="Submit Inquiry"/><br></br><br></br>
                
                {showMessage && <p> Submission inquiry succesfully sent.</p>}
            
              </form>
            </div>
          </div>
        </body>
      </div>
      
    );
  };
  
  export default Submission;
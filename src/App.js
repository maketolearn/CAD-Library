import React, {useState} from 'react';
import MainHeader from './Components/MainHeader';
import CategoryHeader from './Components/CategoryHeader';
import CategoryBanner from './Components/CategoryBanner';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import './Styles/Page.css';

//Home page test
const App = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchObjects, setSearchObjects] = useState([]);
  const [subject, setSubject] = useState("Library");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchObjects([]);
    navigate(`/browse`, {state: searchTerm});
  }

  const redirectToInquire = (event) => {
    event.preventDefault();
    navigate(`/inquire`);
  }

  return (
    <div>
      <body>
        <div class="site">
          <MainHeader input={searchTerm}  setInput={setSearchTerm} handleSubmit={handleSubmit} subject={subject} showFilter={false}></MainHeader>
          <CategoryHeader></CategoryHeader>
          <CategoryBanner subject="Home"></CategoryBanner>

          <div id="page">
            <p>
            The <em>Educational CAD Model Library</em> is an extension of the <a href="https://citejournal.org/">CITE Journal</a>. In the same way that a peer-reviewed journal is a repository of peer-reviewed academic manuscripts, the <em>CAD Library</em> is a repository of peer-reviewed educational objects. The <em>CITE Journal</em> and the <em>CAD Library</em> are sponsored by the <a href="https://ntls.info/">NTLS Coalition</a> and affiliated professional associations. Each sponsoring association selects the editors, curators, and review boards for its area of expertise.
            </p>

            <ul>
              <li>Curator-in-Chief - <Link to="/people/Glen-Bull">Glen Bull</Link></li>
              <li>Curator, Mathematics Education Collection - <Link to="/people/Steven-Greenstein">Steven Greenstein</Link> and <Link to="/people/Allison-McCulloch">Allison McCulloch</Link></li>
              <li>Curator, Science Education Collection - <Link to="/people/Sumreen-Asim">Sumreen Asim</Link></li>
              <li>Curator, Technology Collection - <Link to="/people/Elizabeth-Whitewolf">Elizabeth Whitewolf</Link></li>
              <li>Curator, Engineering Education Collection - <Link to="/people/Ryan-Novitski">Ryan Novitski</Link></li>
            </ul>

            <p>
              We welcome <Link to="/inquire">inquiries</Link> regarding the submission of educational objects designed for K-12 teaching and learning for publication in the <em>CAD Library</em>. If you have designed an educational object and you are interested in submitting it to the library, click the Inquire button below for more information.
            </p>

            <button className='button' onClick={redirectToInquire}>Inquire about the Submission of an Object</button>

            <br></br>

            <p>
              The educational objects on this site are licensed under a <a href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
            </p>
            
          </div>
        </div>
      </body>
    </div>
    
  );
};

export default App;
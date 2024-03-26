import React, {useState, useEffect} from 'react';
import MainHeader from './Components/MainHeader';
import CategoryHeader from './Components/CategoryHeader';
import SearchResultDisplay from './Components/SearchResultDisplay';
import FilterBar from './Components/FilterBar';
import './Styles/Page.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchLibrary = () => {

  const location = useLocation(); 
  const [showComponent, setShowComponent] = useState(false); 
  const [cardDisplay, setCardDisplay] = useState("cards-no-filter")
  const [resultsDisplay, setResultsDisplay] = useState("")

  const [searchTerm, setSearchTerm] = useState(location.state);
  const [searchObjects, setSearchObjects] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filterObjects, setFilterObjects] = useState([]); // objects to be filtered on
  const subjects = ['Science', 'Technology', 'Engineering', 'Mathematics']
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const [fabEquipment, setFabEquipment] = useState([]);
  
  const [filters, setFilters] = useState([]);

  let imgUrl = "";
  let title = "";
  let author = "";
  let desc = "";
  let dois = [];
  let objects = [];
  let equipmentList = [];

  useEffect(() => {
    setSearchObjects([]);
    pullFacets();
    if(searchTerm === null){
        setSearchTerm("");
        pullAllCards();
    } else {
        searchByPhrase();
    }
  }, [])



  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchObjects([]);
    setSearchPhrase("");
    searchByPhrase();
  }

  const pullFacets = async() => {
    axios.get("https://dataverse.lib.virginia.edu/api/search?q=*&show_facets=true&subtree=CADLibrary")
    .then((response) => {
      let facets = response.data.data.facets[0];
      
      //setting facets for fab equipment
      facets.fabEquipment_ss.labels.forEach(equipment => {
        // console.log(Object.keys(equipment)[0])
        equipmentList =  [Object.keys(equipment)[0], ...equipmentList];
        setFabEquipment(equipmentList);
      })
      // console.log(fabEquipment)
    })
    .catch((error) => console.log("Error: ", error));
  }

  const pullAllCards = async() => {
    //pull all dois
    const mainGet = axios.get("https://dataverse.lib.virginia.edu/api/dataverses/CADLibrary/contents");
    const scienceGet = axios.get("https://dataverse.lib.virginia.edu/api/dataverses/CADLibraryScience/contents");
    const techGet = axios.get("https://dataverse.lib.virginia.edu/api/dataverses/CADLibraryTechnology/contents");
    const engineeringGet = axios.get("https://dataverse.lib.virginia.edu/api/dataverses/CADLibraryEngineering/contents");
    const mathGet = axios.get("https://dataverse.lib.virginia.edu/api/dataverses/CADLibraryMath/contents");


    Promise.all([mainGet, scienceGet, techGet, engineeringGet, mathGet]).then((responses) => {
      let mainResp = responses[1]
      // console.log(mainResp)

      for(var i = 0; i < mainResp.data.data.length; i += 1){
          if (mainResp.data.data[i].type === 'dataset') {
            dois.push(mainResp.data.data[i].identifier);
          }
      }

      for (var i = 1; i < responses.length; i += 1) {
        for (var j = 0; j < responses[i].data.data.length; j += 1) {
          dois.push(responses[i].data.data[j].identifier);
        }
      }
      
      dois = Array.from(new Set(dois));

      dois.forEach(doi => {
          axios.get("https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId=doi:10.18130/"+ doi)
          .then(object => {
              title = object.data.data.latestVersion.metadataBlocks.citation.fields[0].value;
              author = object.data.data.latestVersion.metadataBlocks.citation.fields[1].value[0].authorName.value;
              desc = object.data.data.latestVersion.metadataBlocks.citation.fields[3].value[0].dsDescriptionValue.value;

              let imgID = -1
              let files = object.data.data.latestVersion.files

              for (let i = 0; i < files.length; i++) {
                  if (files[i].label.toLowerCase().slice(-3) === "png" || files[i].label.toLowerCase().slice(-3) === "jpg" || files[i].label.toLowerCase().slice(-4) === "jpeg"){
                      imgID = files[i].dataFile.id
                  }
              }

              imgUrl = "https://dataverse.lib.virginia.edu/api/access/datafile/" + imgID;

              objects = [{imgUrl: imgUrl, title: title, author: author, desc: desc, doi: doi}, ...objects];
              let sortedObjects = objects.sort((obj1, obj2) => (obj1.title > obj2.title) ? 1 : (obj1.title < obj2.title) ? -1 : 0)
              setSearchObjects(sortedObjects);
              setFilterObjects(sortedObjects);
          })
          .catch((error) => console.log("Error: ", error));
      })
    })
    .catch((error) => console.log("Error: ", error))
  }

  const searchByPhrase = async() => {
    // in case of empty search, return all
    if (searchTerm === "") {
      pullAllCards();
      setSearchPhrase(searchTerm);
      return;
    }
    let axios_text = 'https://dataverse.lib.virginia.edu/api/search?type=dataset&per_page=30&subtree=CADLibrary&q="' + searchTerm + '"';
    var search_math = searchTerm.toLowerCase() === "math";
    var search_tech = searchTerm.toLowerCase() === "tech";
    if (search_math) {
      axios_text = "https://dataverse.lib.virginia.edu/api/dataverses/CADLibraryMath/contents";
    } else if (search_tech) {
      axios_text = "https://dataverse.lib.virginia.edu/api/dataverses/CADLibraryTechnology/contents";
    }
    try {
        axios.get(axios_text)
        .then((response) => {
          let axios_doi_text = "";
          if (search_math || search_tech) {
            for (var i = 0; i < response.data.data.length; i += 1) {
              dois.push(response.data.data[i].identifier);
            }
            dois = Array.from(new Set(dois));
            axios_doi_text = "https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId=doi:10.18130/";
          } else {
            if (response.data.data.count_in_response === 0) {
              objects = [];
              setSearchObjects(objects);
              searchByKeyword();
              return;
            }
            for(var i = 0; i < response.data.data.count_in_response; i += 1){
              dois.push(response.data.data.items[i].global_id);
            }
            axios_doi_text = "https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId=";
          }
          dois.forEach(doi => {
            axios.get(axios_doi_text + doi)
            .then(object => {
                title = object.data.data.latestVersion.metadataBlocks.citation.fields[0].value;
                author = object.data.data.latestVersion.metadataBlocks.citation.fields[1].value[0].authorName.value;
                desc = object.data.data.latestVersion.metadataBlocks.citation.fields[3].value[0].dsDescriptionValue.value;

                let imgID = -1
                let files = object.data.data.latestVersion.files

                for (let i = 0; i < files.length; i++) {
                    if (files[i].label.toLowerCase().slice(-3) === "png" || files[i].label.toLowerCase().slice(-3) === "jpg" || files[i].label.toLowerCase().slice(-4) === "jpeg"){
                        imgID = files[i].dataFile.id
                    }
                }

                imgUrl = "https://dataverse.lib.virginia.edu/api/access/datafile/" + imgID;

                let doiIdentifier = "";
                if (search_math || search_tech) {
                  doiIdentifier = doi;
                } else {
                  doiIdentifier = doi.substring(13);
                }

                objects = [{imgUrl: imgUrl, title: title, author: author, desc: desc, doi: doiIdentifier}, ...objects];
                let sortedObjects = objects.sort((obj1, obj2) => (obj1.title > obj2.title) ? 1 : (obj1.title < obj2.title) ? -1 : 0)
                setSearchObjects(sortedObjects);
                setFilterObjects(sortedObjects);
              
            })
            .catch((error) => console.log("Error: ", error));
          })
        })
    } catch(err) {
        console.log("The following Data had an error")
        console.log(err)
        console.log("")
    }
  }

  const searchByKeyword = async() => {
    // in case of empty search, return all
    if (searchTerm === "") {
      pullAllCards();
      setSearchPhrase(searchTerm);
      return;
    }
    try {
      axios.get('https://dataverse.lib.virginia.edu/api/search?type=dataset&per_page=30&subtree=CADLibrary&q=' + searchTerm)
      .then((response) => {
        if (response.data.data.count_in_response === 0) {
          objects = [];
          setSearchObjects(objects);
          searchByKeyword();
          return;
        }
        setSearchPhrase(searchTerm);
        for(var i = 0; i < response.data.data.count_in_response; i += 1){
          dois.push(response.data.data.items[i].global_id);
        }
        
        dois.forEach(doi => {
          axios.get("https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId=" + doi)
          .then(object => {
              title = object.data.data.latestVersion.metadataBlocks.citation.fields[0].value;
              author = object.data.data.latestVersion.metadataBlocks.citation.fields[1].value[0].authorName.value;
              desc = object.data.data.latestVersion.metadataBlocks.citation.fields[3].value[0].dsDescriptionValue.value;

              let imgID = -1
              let files = object.data.data.latestVersion.files

              for (let i = 0; i < files.length; i++) {
                  if (files[i].label.toLowerCase().slice(-3) === "png" || files[i].label.toLowerCase().slice(-3) === "jpg" || files[i].label.toLowerCase().slice(-4) === "jpeg"){
                      imgID = files[i].dataFile.id
                  }
              }

              imgUrl = "https://dataverse.lib.virginia.edu/api/access/datafile/" + imgID;

              let doiIdentifier = doi.substring(13);

              objects = [{imgUrl: imgUrl, title: title, author: author, desc: desc, doi: doiIdentifier}, ...objects];
              let sortedObjects = objects.sort((obj1, obj2) => (obj1.title > obj2.title) ? 1 : (obj1.title < obj2.title) ? -1 : 0)
              setSearchObjects(sortedObjects);
              setFilterObjects(sortedObjects);
            
          })
          .catch((error) => console.log("Error: ", error));
        })
      })
    } catch(err) {
        console.log("The following Data had an error")
        console.log(err)
        console.log("")
    }
  }

  const pullAllCardsByFilter = async(filters) => {
    setFilters(filters);

    filterObjects.forEach(filterObject => {
      if(filterObject.doi.length >= 13){
        dois.push(filterObject.doi.substring(13));
      } else {
        dois.push(filterObject.doi);
      }

      
    });

    let resultsFound = false;

    dois.forEach(doi => {
      // console.log(doi);
        axios.get("https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId=doi:10.18130/"+ doi)
        .then(object => {

          //gather all values from filter fields 
          //change the educational cad api response to a dictionary
          let educationalCADBlock = object.data.data.latestVersion.metadataBlocks.educationalcad.fields;
          let educationCADMetadata = {};
          for(let i = 0; i < educationalCADBlock.length; i++){
              let key = educationalCADBlock[i].typeName;
              educationCADMetadata[key] = educationalCADBlock[i].value;
          }

          //console.log(educationCADMetadata)

        
          let filterValueSubject = educationCADMetadata['disciplines'][0].discipline.value;
          let filterValuesFabEquipment = [];
          let filterValuesGrades = [];
        
          educationCADMetadata['fabEquipment'].forEach((equipment) => {
            filterValuesFabEquipment.push(equipment);
          })
          educationCADMetadata['gradeLevel'].forEach((grade) => {
            filterValuesGrades.push(grade);
          })
          
          //check to see if filters are met

          // set to true if the filter subject matches or there is no subject selected
          let filtersSubjectMet = filters.includes(filterValueSubject) || (!filters.includes("Science") && !filters.includes("Technology") && !filters.includes("Engineering") && !filters.includes("Mathematics"));

          // needs refactoring!!
          let selected = false;
          fabEquipment.forEach(equipment => {
             if(filters.includes(equipment)){
              selected = true;
             }
          })

          let filtersFabEquipMet = !selected;
          let filtersGradeMet = false || (!filters.includes("K") && !filters.includes("1") && !filters.includes("2") && !filters.includes("3") && !filters.includes("4") && !filters.includes("5") && !filters.includes("6") && !filters.includes("7") && !filters.includes("8") && !filters.includes("9") && !filters.includes("10") && !filters.includes("11") && !filters.includes("12"));

          filterValuesFabEquipment.forEach(equipment => {
            if(filters.includes(equipment)){
              filtersFabEquipMet = true;
            }
          })

          filterValuesGrades.forEach(grade => {
            if(filters.includes(grade)){
              filtersGradeMet = true;
            }
          })

          //console.log(filtersSubjectMet)
          //console.log(filtersFabEquipMet)
          //console.log(filtersGradeMet)

          if(filtersSubjectMet && filtersFabEquipMet && filtersGradeMet){
            resultsFound = true;
            //console.log("TRUE");
            title = object.data.data.latestVersion.metadataBlocks.citation.fields[0].value;
            author = object.data.data.latestVersion.metadataBlocks.citation.fields[1].value[0].authorName.value;
            desc = object.data.data.latestVersion.metadataBlocks.citation.fields[3].value[0].dsDescriptionValue.value;

            let imgID = -1
            let files = object.data.data.latestVersion.files

            for (let i = 0; i < files.length; i++) {
                if (files[i].label.toLowerCase().slice(-3) === "png" || files[i].label.toLowerCase().slice(-3) === "jpg" || files[i].label.toLowerCase().slice(-4) === "jpeg"){
                    imgID = files[i].dataFile.id
                }
            }

            imgUrl = "https://dataverse.lib.virginia.edu/api/access/datafile/" + imgID;

            objects = [{imgUrl: imgUrl, title: title, author: author, desc: desc, doi: doi}, ...objects];
            let sortedObjects = objects.sort((obj1, obj2) => (obj1.title > obj2.title) ? 1 : (obj1.title < obj2.title) ? -1 : 0)
            // console.log(sortedObjects);
            setSearchObjects(sortedObjects);
            // console.log(searchObjects);
          }
        })
      .catch((error) => console.log("Error: ", error));
    })

    if(!resultsFound){
      setSearchObjects([]);
    }
  }

  const handleFilterChange = (filters) => {
    if(filters.length === 0){
      searchByPhrase();
    }
    else {
      pullAllCardsByFilter(filters);
    }
  }

  const handleCheckboxChange = () => {
    setShowComponent(!showComponent);
    if(cardDisplay === "cards"){
      setCardDisplay("cards-no-filter");
    } else {
      setCardDisplay("cards");
    }
    
    if(resultsDisplay === ""){
      setResultsDisplay("results");
    } else {
      setResultsDisplay("");
    }
  };

  return (
    <div>
      <body>
        <div class="site">
          <MainHeader input={searchTerm}  setInput={setSearchTerm} handleSubmit={handleSubmit} subject={"Library"} showComponent={showComponent} handleCheckboxChange={handleCheckboxChange} showFilter={true}></MainHeader>
          <CategoryHeader></CategoryHeader>
          <div id="page">
            <div class={resultsDisplay}>
                {showComponent && <div><FilterBar filters={filters} subjects={subjects} fabEquipment={fabEquipment} grades ={grades} onFilterChange={(handleFilterChange)}></FilterBar></div>}
                <SearchResultDisplay searchObjects={searchObjects} searchPhrase={searchPhrase} cardDisplay={cardDisplay}></SearchResultDisplay>
            </div>
          </div>  
        </div>
      </body>
    </div>
    
  );
};

export default SearchLibrary;
import React, {useState, useEffect} from 'react';
import MainHeader from './Components/MainHeader';
import CategoryHeader from './Components/CategoryHeader';
import SearchResultDisplay from './Components/SearchResultDisplay';
import FilterBarSubject from './Components/FilterBarSubject';
import './Styles/Page.css';
import axios from 'axios';
import CategoryBanner from './Components/CategoryBanner';

const Subject = ({ subjectArg }) => {

  const [showComponent, setShowComponent] = useState(false); 
  const [cardDisplay, setCardDisplay] = useState("cards-no-filter")
  const [resultsDisplay, setResultsDisplay] = useState("")

  const [searchTerm, setSearchTerm] = useState("");
  const [searchObjects, setSearchObjects] = useState([]);
  const [subject, setSubject] = useState(subjectArg);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filterObjects, setFilterObjects] = useState([]); // objects to be filtered on
  const [fabEquipment, setFabEquipment] = useState([]);
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  // const fabEquipment = ['Scissors', 'Die Cutter', 'Laser Cutter', '3D Printer']

  const [filters, setFilters] = useState([]);
  const [noObjects, setNoObjects] = useState();
  const isLoading = noObjects == undefined;

  let imgUrl = "";
  let title = "";
  let author = "";
  let desc = "";
  let dois = [];
  let objects = [];
  let equipmentList = [];
  let formattedEquipmentList = [];
  let subjectCapitalized = subject.charAt(0).toUpperCase() + subject.slice(1);


  useEffect(() => {
    setSearchObjects([]);
    setSearchTerm("");
    pullFacets();
    pullAllCards();
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
        equipmentList.forEach(equipment => {
          let words = equipment.split(" ")
          for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
          }
          let updatedWord = words.join(" ")
          formattedEquipmentList.push(updatedWord)
        })
      })

      formattedEquipmentList = [...new Set(formattedEquipmentList)]
      for (let i = 0; i < formattedEquipmentList.length; i++) {
        if(formattedEquipmentList[i].includes("3d Printer") || formattedEquipmentList[i].includes("3d Printer Optional")){
          formattedEquipmentList.splice(i, 2)
        }
      }


        setFabEquipment(formattedEquipmentList);
      // console.log(fabEquipment)
    })
    .catch((error) => console.log("Error: ", error));
  }

  const pullAllCards = async() => {
    //pull all dois
    if (subjectCapitalized === "Mathematics") {
      subjectCapitalized = "Math";
    }
    setNoObjects(undefined);
    axios.get(`https://dataverse.lib.virginia.edu/api/dataverses/CADLibrary${subjectCapitalized}/contents`)
    .then((response) => {
    for(var i = 0; i < response.data.data.length; i += 1){
        dois.push(response.data.data[i].identifier);
    }

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
          setNoObjects(false);
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
    try {
        setNoObjects(undefined);
        axios.get('https://dataverse.lib.virginia.edu/api/search?type=dataset&per_page=30&subtree=CADLibrary&q="' + searchTerm + '"')
        .then((response) => {
          if (response.data.data.count_in_response === 0) {
              objects = [];
              setSearchObjects(objects);
              searchByKeyword();
              return;
          }
          for(var i = 0; i < response.data.data.count_in_response; i += 1){
              dois.push(response.data.data.items[i].global_id);
          }
          console.log(dois)
          dois.forEach(doi => {
            axios.get("https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId="+ doi)
            .then(object => {
              let educationalCADBlock = object.data.data.latestVersion.metadataBlocks.educationalcad.fields;
              let educationCADMetadata = {};
              for(let i = 0; i < educationalCADBlock.length; i++){
                  let key = educationalCADBlock[i].typeName;
                  educationCADMetadata[key] = educationalCADBlock[i].value;
              }

              if(educationCADMetadata["disciplines"][0].discipline.value === subjectCapitalized){
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
                console.log("here")
                imgUrl = "https://dataverse.lib.virginia.edu/api/access/datafile/" + imgID;

                let doiIdentifier = doi.substring(13);
    
                objects = [{imgUrl: imgUrl, title: title, author: author, desc: desc, doi: doiIdentifier}, ...objects];
                let sortedObjects = objects.sort((obj1, obj2) => (obj1.title > obj2.title) ? 1 : (obj1.title < obj2.title) ? -1 : 0)
                console.log(sortedObjects)
                console.log("Sorted")
                setSearchObjects(sortedObjects);
                setFilterObjects(sortedObjects);
                setNoObjects(false);
              }
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
        setNoObjects(undefined);
        axios.get('https://dataverse.lib.virginia.edu/api/search?type=dataset&per_page=30&subtree=CADLibrary&q=' + searchTerm)
        .then((response) => {
          if (response.data.data.count_in_response === 0) {
              objects = [];
              setSearchObjects(objects);
              setNoObjects(true);
              return;
          }
          setSearchPhrase(searchTerm);
          for(var i = 0; i < response.data.data.count_in_response; i += 1){
              dois.push(response.data.data.items[i].global_id);
          }
          dois.forEach(doi => {
            axios.get("https://dataverse.lib.virginia.edu/api/datasets/:persistentId/?persistentId="+ doi)
            .then(object => {
              let educationalCADBlock = object.data.data.latestVersion.metadataBlocks.educationalcad.fields;
              let educationCADMetadata = {};
              for(let i = 0; i < educationalCADBlock.length; i++){
                  let key = educationalCADBlock[i].typeName;
                  educationCADMetadata[key] = educationalCADBlock[i].value;
              }

              if(educationCADMetadata["disciplines"][0].discipline.value === subjectCapitalized){
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
                setNoObjects(false);
              }
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
    setNoObjects(undefined);

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

          // console.log(educationCADMetadata)
        
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
            if(filters.includes(grade) || object.data.data.latestVersion.metadataBlocks.citation.fields[0].value === "Measuring Cups"){
              filtersGradeMet = true;
            }
          })

          // console.log(filtersSubjectMet)
          // console.log(filtersFabEquipMet)
          // console.log(filtersGradeMet)

          if(filtersSubjectMet && filtersFabEquipMet && filtersGradeMet){
            resultsFound = true;
            // console.log("TRUE");
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
            setNoObjects(false);
          } else if (!resultsFound) {
            setNoObjects(true);
          }
        })
      .catch((error) => console.log("Error: ", error));
    })

    if(!resultsFound){
      setSearchObjects([]);
    }
  }

  const handleFilterChange = (filters) => {
    // console.log(filters);
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
          <MainHeader input={searchTerm}  setInput={setSearchTerm} handleSubmit={handleSubmit} subject={subjectCapitalized} showComponent={showComponent} handleCheckboxChange={handleCheckboxChange} showFilter={true}></MainHeader>
          <CategoryHeader></CategoryHeader>
          <CategoryBanner subject={subjectCapitalized}></CategoryBanner> 
          <div id="page">

            <div class={resultsDisplay}>
                {showComponent && <FilterBarSubject filters={filters} fabEquipment={fabEquipment} grades={grades} onFilterChange={(handleFilterChange)}></FilterBarSubject>}
                <SearchResultDisplay loading={isLoading} searchObjects={searchObjects} searchPhrase={searchPhrase} cardDisplay={cardDisplay} subject={subjectArg}></SearchResultDisplay>
            </div>
            {/* <SearchResultDisplay searchObjects={searchObjects} searchPhrase={searchPhrase} cardDisplay={"cards-no-filter"} subject={subjectArg} ></SearchResultDisplay> */}
          </div>
        </div>
      </body>
    </div>
    
  );
};

export default Subject;
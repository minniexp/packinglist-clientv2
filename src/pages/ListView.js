import React, { useEffect, useState } from "react";
import List from "../components/List";
import NewList from "../components/NewList";
import Change from "../components/Change";
import Axios from "axios";
import { useLocation } from "react-router-dom";

import "../styles/ListView.css";

export default function ListView(props) {

  const [categories, setCategories] = useState([]);
  const [changeClick, setChangeClick] = useState(false);
  const [newListClick, setNewListClick] = useState(false);
  const [newListCreated, setNewListCreated] = useState(false);
  const [deleteCateogryClick, setDeleteCateogryClick] = useState(false);
  const [test, setTest] = useState("");

  /* NEW useStates */
  const [title, setTitle] = useState(localStorage.getItem("listname"));
  const [dataInput, setDataInput] = useState([])
  // const [dataInput, setDataInput] = useState([{"categoryName": "test"}, {"categoryName": "test2"}, {"categoryName": "test3"}, ]);
  const [dataOutput, setDataOutput] = useState([]);
  const [counter, setCounter] = useState(0)
  const [listObjID, setListObjID] = useState("");


  // const [listID, setListID] = useState("")


  // const [currentList, setCurrentList] = useState(()=>{
  //     return window.localStorage.getItem('listClicked') || []
  // })
  // const [currentList, setCurrentList] = useState(props.listTitle)
  const location = useLocation();
  const apiURL = process.env.REACT_APP_API_URL;

  function handleArray(input, property, filterproperty, filtertitle) {
    for (let i = 0; i < input.length; i++) {
      if (input[i][filterproperty] === filtertitle) {
        setCategories((oldArray) => [...oldArray, input[property]]);
      }
    }
  }

  // const filteredItems = items.filter(item => {
  // return item.toLowerCase().includes(query.toLowerCase())
  // })

  const nodupliatecategory = [...new Set(categories)];

  const handleNewListCreated = () => {
    setNewListCreated((prev) => !prev);
  };

  // Need to fix handleDelete
  const handleDeleteCateogry = () => {
    setDeleteCateogryClick((prev) => !prev);
  };

  const handleChangeClick = () => {
    setChangeClick(prev => !prev)
  }

  const handleDataOutput = (item) => {
    setDataOutput(item)
  }

  // const handleDataInput = (item) => {
  //   setDataInput(prev => [...prev, item])
  // }

  const dataToString = (dataArray) => {
    let stringData = dataArray.map(object => {
      let objectString = object.categoryName + " " + object.items.join(" ")
      return objectString
    })
    return stringData.join(" ")
  }         

  useEffect(() => {
    // setCurrentList(props.listTitle)
    setCategories([]);

    let listID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
    setListObjID(listID)
    let localStorageData = localStorage.getItem(listID)
    let listStorageData = JSON.parse(localStorageData)
    console.log("Listview.js listStorageData: ", listStorageData)

    if (localStorageData !== null) {
      setTitle(localStorage.getItem("listname"))
      setDataOutput(listStorageData)
    } else {
      console.log("localStorage not exist")
      Axios.get(`${apiURL}/api/v1/finalcheck/getlist/${listID}`)
        .then((response) => {
          // console.log("response cateogry: ", response)
          setTitle(response.data[0].listName);
          setDataInput(response.data[1])

          console.log("response data: ", response.data[1])

          let dataObject = {}
          let dataArray = response.data[1].map((obj, key) =>{
            let object = {"categoryName": obj.categoryName, "items": obj.items}
            setCounter(key)
            return object
          })
          setDataOutput(dataArray)

          dataObject[listID] = dataArray
          // console.log("dataobject", dataObject)
          let stringObj = JSON.stringify(dataObject)
          localStorage.setItem(listID, JSON.stringify(dataArray))
          // console.log("localStorage setting")


          let output = response;
          setNewListClick(false);
          return output;
        })
        .catch((error) => console.log(error));
    }
  }, [newListCreated, deleteCateogryClick, changeClick]);

  const handleSave = () => {
    console.log("handle Save FIRST")
    let listID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)

    // console.log("dataInput[key].categoryName: ", dataInput[0].categoryName)
    let index = 0
    let listNameTitle = localStorage.getItem("listname")
    console.log("listNameTitle: ", listNameTitle)
    // update title
    Axios.post(`${apiURL}/api/v1/finalcheck/update/title`, {
      "id": listID, 
      "listName": listNameTitle,
    })
    .then(() => {
      console.log("successful title save");
    })
    .catch((error) => console.log(error));

    console.log("Listview.js datainput: ", dataInput)
    dataOutput.map((item, key) => {
      console.log("Listview.js dataoutput key: ", key)
      index = key
      console.log("item: ", item.categoryName)

      if (key < dataInput.length){
        console.log("inside key < dataInput.length")
        Axios.post(`${apiURL}/api/v1/finalcheck/update/category`, {
          "list_id": listID, 
          "category_id": dataInput[key]._id,
          "categoryName": item.categoryName,
          "items": item.items,
        })
        .then(() => {
          console.log("successful save");
        })
        .catch((error) => console.log(error));
        
      } else {
        if (key >= dataInput.length){
          console.log("inside key < dataInput.length")

          console.log("inside loop")
          Axios.post(`${apiURL}/api/v1/finalcheck/create/category`, {
            "list_id": listID, 
            "categoryName": item.categoryName,
            "items": item.items,
          })
          .then(() => {
            console.log("successful save");
          })
          .catch((error) => console.log(error));
        }

      }
    })
    // for(let i=index; i<dataInput.length; i++){
    //   console.log("Listview.js delete dataINput: ", dataInput[i])
    //   // CREATE DELETE API CALL
    // }
  console.log("handle Save END")

}
  // useEffect(()=>{
  //     window.localStorage.setItem('listClicked', JSON.stringify(listName))
  // },[listName])

  // useEffect(()=>{
  //     const data = window.localStorage.getItem('listClicked')
  //     if (data !== null ) {
  //         setCurrentList(data)
  //         console.log("useeffect running")
  //     }

  // },[])

  // window.onload = function () {
  //     const data = window.localStorage.getItem('listClicked')
  //     if (data !== null ) {
  //         setCurrentList(data)
  //         console.log("useeffect running")
  //     }
  // }
  // useEffect(()=>{
  //     window.localStorage.setItem('listClicked', currentList)
  // },[currentList])
  let categoryIndex = -1;
  return (
    <div className="listcontent-container">
      <div className="mylist-container">
        <h2 className="listName-header">
          {/* {console.log("Listview.js title1: ", title)} */}
          <Change select="title" description={title} test={test} changeClick={changeClick} handleChangeClick={handleChangeClick}/>
        </h2>
        <button className="create-list-btn" id="save" onClick={handleSave}>
          Save
        </button>
       </div> 
      <div className="list-container">
        {dataOutput.map((data) => {
          categoryIndex++
          console.log("Listview.js", categoryIndex)
          return (
          data ? <List
            listName={title}
            category={data.categoryName}
            handleDeleteCateogry={handleDeleteCateogry}
            location={location}
            items={data.items}
            dataOuput={dataOutput}
            handleDataOutput={handleDataOutput}
            categoryIndex={categoryIndex}
          />
          : ""
        )})}
        <div className="new-list-container">
          {newListClick ? (
            <NewList
              listName={title}
              newListCreated={newListCreated}
              handleNewListCreated={handleNewListCreated}
              location={location}
              dataOuput={dataOutput}
              handleDataOutput={handleDataOutput}
              // handleDataInput={handleDataInput}
            ></NewList>
          ) : (
            <button
              className="new-list-btn"
              onClick={() => setNewListClick((prev) => !prev)}
            >
              New Category
            </button>
          )}
        </div>        
      </div> 
      {console.log("dataOutput FINAL: ", dataOutput)}
      {/* {console.log("dataInput FINAL: ", dataInput)} */}

      {/* {dataOutput ? "true" : "False"} */}
    </div>
  );
}


    // get all cards from list title

    // when you start up the component construct the json of key which name of list to value which is array of string items 
    // var localList = localStorage.getItem("listkey", "json string")
    // console.log("localList: ", localList)
    // if (localList != null) {
    //   console.log(localStorage.getItem("listkey"))
    //   // this will give you the most updated vrsion of the hson 
    // } else {
    //   Axios.get(`${apiURL}/api/v1/finalcheck/getlist/${location.pathname}`)
    //   .then((response) => {
    //     console.log("response: ", response)
    //     setTitle(response.data.categoryName);
    //     listName = response.data.categoryName;
    //     setTest(response.data);
    //     console.log("listname", response.data.categoryName);
    //     let output = response.data;
    //     handleArray(output, "category", "title", listName);
    //     setNewListClick(false);
    //     return output;
    //   })
    //   .catch((error) => console.log(error));


    //   localStorage.setItem("listkey", "json string")
    // }

                // setDataOutput(prev => {
            //   let object = {...prev}
            //   object[`c${key}`] = obj.categoryName
            //   return object
            //   })
      
            //   obj.items.map((item, index) => {
            //     setDataOutput(prev=> {
            //       let object = {...prev}
            //       object[`c${key}i${index}`] = item
                  
            //       return object
            //     })
            //   })
            // setCounter(key)
            //   return object
            // }
            // )
            // setDataOutput(prev => {
            //   let object = {...prev}
            //   object["final"] = dataOutput.c1 + dataOutput.c2
            //   return object
            //   })
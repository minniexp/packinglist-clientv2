import React, { useState, useEffect, useRef } from "react";
import EditList from "./EditList";
import Change from "./Change";

// import { SlOptionsVertical, SlTrash } from "react-icons/sl"
// import {MdOutlineCancel} from "react-icons/md"
import Axios from "axios";

import "../styles/List.css";

export default function List(props) {
  let listName = props.listName;
  let items = props.items
  let dataOuput = props.dataOuput
  const category = props.category;
  const location = props.location;
  let categoryIndex = props.categoryIndex
  const [taskObjects, settaskObjects] = useState([]);
  const [newTaskClick, setNewTaskClick] = useState(false);
  const [newEditClick, setNewEditClick] = useState(false);
  const [title, setTitle] = useState(listName);

  const [newItem, setNewItem] = useState("");
  const apiURL = process.env.REACT_APP_API_URL;

  const inputRef = useRef();

  function handleNewTask(e) {
    setNewItem(e.target.value);
  }

  const handleEditClick = () => {
    setNewEditClick(prev => !prev)
  }

  // function handleObjectArray(
  //   input,
  //   property,
  //   titleproperty,
  //   filtertitle,
  //   categoryproperty,
  //   filtercategory
  // ) {
  //   for (let i = 0; i < input.length; i++) {
  //     if (input[i][titleproperty] === filtertitle) {
  //       if (input[i][categoryproperty] === filtercategory) {
  //         settaskObjects((oldArray) => [
  //           ...oldArray,
  //           { id: input[i]["id"], task: input[i][property] },
  //         ]);
  //       }
  //     }
  //   }
  //   // console.log(taskObjects);
  // }

  useEffect(() => {
    settaskObjects([]);
    // Axios.get(`${apiURL}/api/v1/finalcheck/getlist/${location.pathname}`)
    //   .then((response) => {
    //     listName = response.data.rows[0].title;
    //     setTitle(response.data.rows[0].title);
    //     console.log("listname", response.data.rows[0].title);
    //     let output = response.data.rows;

    //     handleObjectArray(
    //       output,
    //       "item",
    //       "title",
    //       listName,
    //       "category",
    //       category
    //     )

    //     console.log("taskObjects", taskObjects);
    //     return output;
    //   })
    //   .catch((error) => console.log(error));
  }, [newTaskClick, newEditClick]);

  const submitReview = (e) => {
    let listID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)

    e.preventDefault();

    let itemsArray = [];
    let key = 0
    let updatedArray = []
    dataOuput.map(data=> {
      if(data.categoryName === category){
        itemsArray = data.items
        itemsArray.push(newItem)
        updatedArray[key] = {"categoryName": data.categoryName, "items": itemsArray}
      }
      updatedArray[key] = {"categoryName": data.categoryName, "items": data.items}
      key++
    })

    props.handleDataOutput(updatedArray)
    localStorage.setItem(listID, JSON.stringify(updatedArray))

    // Axios.post(`${apiURL}/api/v1/finalcheck/additem`, {
    //   title: listName,
    //   category: category,
    //   item: newItem,
    // })
    //   .then(() => {
    //     console.log("successful insert");
    //     setNewTaskClick((prev) => !prev);
    //   })
    //   .catch((error) => console.log(error));
    inputRef.current.value = "";
  };

  // const deleteItem = () => {
  //     Axios.post(`${apiURL}/deletecategory`, {id: editId}).then(()=>{
  //         console.log("successfuly deleted category")

  //     })
  //     setDeleteTask(true)
  //     inputRef.current.value=""
  //     setOptionsClick(prev=>!prev)
  //     };
  let itemIndex = -1;
  return (
    <div className="todo-container">
                {/* {console.log("List.js title: ", title)} */}

      <p>
        <Change
          select="category"
          description={category}
          title={title}
          handleDeleteCateogry={props.handleDeleteCateogry}
          handleEditClick={handleEditClick}
          categoryIndex={categoryIndex}
          handleDataOutput={props.handleDataOutput}
        />
      </p>
      <div className="checklist-total">
        <table>
          {items.map((item, key) =>{
            itemIndex++
           return (

            <tr className="checklist">
              {/* <th className="checklist-checkbox">
                                <input className="checkbox" type="checkbox" id="completed"/>
                            </th>
                            <th className="checklist-description">
                                <label htmlFor="completed" key={key}>{item.task}</label>
                            </th> */}
              {/* {console.log(item)} */}
              <EditList 
                key={key} 
                task={item} 
                title={title} 
                itemIndex={itemIndex} 
                categoryIndex={categoryIndex} 
                handleDataOutput={props.handleDataOutput}
              />
            </tr>
            

          )})}
        </table>
      </div>

      <div className="checklist-add">
        <hr />
        <input
          type="text"
          name="item"
          className="checklist-add"
          ref={inputRef}
          onChange={handleNewTask}
        />
        <button onClick={submitReview}>Add</button>
      </div>
    </div>
  );
}

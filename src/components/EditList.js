import React, { useState, useRef } from "react";
import { SlOptionsVertical, SlTrash } from "react-icons/sl";
import { MdOutlineCancel } from "react-icons/md";
import { useLocation } from "react-router-dom";

import Axios from "axios";

import "../styles/List.css";

export default function EditList(props) {
  let editId = props.id;
  let task = props.task
  let title = props.title
  let itemIndex = props.itemIndex
  let categoryIndex = props.categoryIndex
  const [optionsClick, setOptionsClick] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [currKey, setCurrKey] = useState(props.key);

  const [currentTask, setCurrentTask] = useState(task);

  const [edittask, setEditTask] = useState(task);
  const inputRef = useRef();
  const apiURL = process.env.REACT_APP_API_URL;
  const location = useLocation();

  let listID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
  let localData = localStorage.getItem(listID)
  let parseLocalData = JSON.parse(localData)

  const editItem = () => {
    parseLocalData[categoryIndex].items[itemIndex] = edittask
    console.log("EditList.js localData", parseLocalData)
    props.handleDataOutput(parseLocalData)

    localStorage.setItem(listID, JSON.stringify(parseLocalData))

    setCurrentTask(edittask);
    inputRef.current.value = "";
    setOptionsClick((prev) => !prev);
  };


  const deleteItem = () => {
    let udpatedArray = []
    parseLocalData[categoryIndex].items.map((data, key)=>{
      console.log("data", data)
      console.log("key", key)
      if (key !== itemIndex){
        udpatedArray.push(data)
      }
    })

    parseLocalData[categoryIndex].items = udpatedArray
    props.handleDataOutput(parseLocalData)
    localStorage.setItem(listID, JSON.stringify(parseLocalData))

    // Axios.post(`${apiURL}/api/v1/finalcheck/deleteitem`, { id: editId })
    //   .then(() => {
    //     console.log("successfuly deleted item");
    //   })
    //   .catch((error) => console.log(error));
    setDeleteTask(true);
    inputRef.current.value = "";
    setOptionsClick((prev) => !prev);
  };

  function handleExit() {
    setOptionsClick((prev) => !prev);
  }

  return (
    <div className="edit-list-container">
      {/* {console.log("task is: ", task)} */}
      {/* <th className="checklist-checkbox">
                <input className="checkbox" type="checkbox" id="completed"/>    
            </th>
            <th className="checklist-description">
                <label htmlFor="completed" key={props.key}>{props.task}</label>
            </th> */}
      <div>
        {deleteTask ? (
          ""
        ) : optionsClick ? (
          <div className="edit-list-container">
            <div className="edit-list-form">
              <input
                className="edit-list-form-input"
                index={itemIndex}
                ref={inputRef}
                type="text"
                placeholder={props.task}
                keyIndex={props.key}
                onChange={(e) => setEditTask(e.target.value)}
                value={edittask}
              />              
              <button className="edit-list-form-btn" onClick={editItem}>
                Edit
              </button>
            </div>
            <SlTrash
              onClick={deleteItem}
              size={20}
              style={{ color: "#5C5F62" }}
            />
            <MdOutlineCancel
              onClick={handleExit}
              size={20}
              style={{ color: "#5C5F62" }}
            />
          </div>
        ) : (
          <div className="checklist-total-container">
            <div className="checklist-container">
              <th className="checklist-checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id={`${props.id}`}
                />
              </th>
              <th className="checklist-description">
                <label htmlFor={`${props.id}`} key={props.key}>
                  {currentTask}
                </label>
              </th>
            </div>
            <div className="options">
              <th onClick={() => setOptionsClick((prev) => !prev)}>
                <SlOptionsVertical size={20} style={{ color: "#5C5F62" }} />
              </th>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef } from "react";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import EditList from "./EditList";

import "../styles/List.css";

export default function NewList(props) {
  let listName = props.listName;
  let dataOuput = props.dataOuput
  const [title, setTitle] = useState(localStorage.getItem("listname"));

  const [tasks, setTasks] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const apiURL = process.env.REACT_APP_API_URL;

  const location = useLocation();

  const inputRef = useRef();
  function handleNewTask(e) {
    setNewItem(e.target.value);
  }

  const submitReview = () => {
    // setTasks((oldArray) => [...oldArray, newItem]);
    let updatedTask = [...tasks, newItem]
    let listID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
    let localStorageData = localStorage.getItem(listID)
    let listStorageData = JSON.parse(localStorageData)
    console.log("NewList.js listStorageData: ", listStorageData)
    listStorageData = [...listStorageData, {"categoryName": newCategory, "items": updatedTask}]
    
    props.handleDataOutput(prev => [...prev, {"categoryName": newCategory, "items": updatedTask}])

    localStorage.setItem(listID, JSON.stringify(listStorageData))
    // Axios.post(`${apiURL}/api/v1/finalcheck/additem`, {
    //   title: listName,
    //   category: newCategory,
    //   item: newItem,
    // }).then(() => {
    //   console.log("successful insert");
    //   props.handleNewListCreated();
    // });
    inputRef.current.value = "";
    // categoryInputRef.current.value= "";
    setNewCategory("")
  };

  return (
    <div className="todo-container">
      <div className="checklist-add">
        <input
          type="text"
          name="newCategory"
          value={newCategory}
          className="checklist-add"
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </div>

      <div className="checklist-total">
      {tasks.map((item, key) => (
            <tr className="checklist">
              {/* <th className="checklist-checkbox">
                                <input className="checkbox" type="checkbox" id="completed"/>    
                            </th>
                            <th className="checklist-description">
                                <label htmlFor="completed" key={key}>{item.task}</label>
                            </th> */}
              {/* {console.log(item)} */}
              <EditList key={key} task={item} title={title}/>
            </tr>
          ))}
        {/* {tasks.map((task) => (
          <div className="checklist">
            <label htmlFor="completed">{task}</label>
            <input className="checkbox" type="checkbox" id="completed" />
            
          </div>
        ))} */}

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

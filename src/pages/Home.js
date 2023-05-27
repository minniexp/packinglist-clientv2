import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Axios from "axios";
import "../styles/Home.css";
import Iconimg from "../images/searchIcon.png";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import { ThreeDots } from "react-loader-spinner";
import NewList from "../components/NewList";

export default function Home(props) {
  let navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [dataResponse, setDataReponse] = useState([]);
  const [query, setQuery] = useState("");
  const [newListClick, setNewListClick] = useState(false);

  const inputRef = props.inputRef;
  const inputSearchRef = props.inputSearchRef;
  const apiURL = process.env.REACT_APP_API_URL;



  const createList = (listName) => {
    Axios.post(`${apiURL}/api/v1/finalcheck/create/list`, {
      "listName": listName
    }).then((res) => {
      console.log("res content: ", res);
      let newListID = res.data._id
      let urlString = `/list/${newListID}`
      console.log("urlStringNow is ", urlString)
      localStorage.setItem("listname", res.data.listName)

      setQuery(listName)
      navigate(urlString)
    });

  };

  function onSubmit(e) {
    e.preventDefault();
    console.log("onsubmit called");

    const valueInputList = inputRef.current.value;
    if (valueInputList === "") return;
    createList(valueInputList)
    setItems((prev) => [...prev, valueInputList]);
    inputRef.current.value = "";
    toggleCreateList();

  }

  function onSearch(e) {
    e.preventDefault();

    const valueInputSearch = inputSearchRef.current.value;
    props.listTitle(query);
    if (valueInputSearch === "") return;
    inputSearchRef.current.value = "";
  }

  const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
      promiseInProgress && (
        <div
          style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThreeDots color="#6F47EB" />
        </div>
      )
    );
  };

  useEffect(() => {
    console.log("getting all lists");

    trackPromise(
      Axios.get(`${apiURL}/api/v1/finalcheck/getAllLists`).then((response) => {
        if (!response) {
          console.log("response is empty");
          return;
        }
        // console.log("response : ", response)
        let output = response.data;
        // let output = response.data.rows;
        setDataReponse(output);
        return output;
      })
    );
  }, [apiURL]);

  const filteredItems = dataResponse.filter((item) => {
    // console.log('item 123' + item.listName)
    return item.listName.toLowerCase().includes(query.toLowerCase())
  });

  function handleQuery(e) {
    props.listTitle(e.currentTarget.value);   
    localStorage.setItem("listname", e.currentTarget.value)
  }

  function toggleCreateList() {
    setNewListClick((prev) => !prev);
  }

  return (
    <div className="Home">
      <div className="introduction">
        <p>Find your ulimate packing list</p>
        <h1>For any occasion, trip, and more</h1>
        <p>Click on the desired list or create your own</p>
      </div>
      <div className="search-bar">
        <img src={Iconimg} className="search-bar-icon" />
        <input
          onSubmit={onSearch}
          type="search"
          // name="query"
          ref={inputSearchRef}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search List Name"
          className="search-bar-input"
        />
      </div>

      {newListClick ? (
        <form onSubmit={onSubmit} className="create-list-form">
          <input
            className="create-list-form-input"
            ref={inputRef}
            type="text"
            placeholder="Create New List"
          />
          <button className="creat-list-form-btn" type="submit">
            Add
          </button>
        </form>
      ) : (
        <button className="create-list-btn" onClick={toggleCreateList}>
          Create New List
        </button>
      )}

      <LoadingIndicator />

      <div className="search-output">
        {filteredItems.map((item) => {
          let urlString = `list/${item._id}`;
          return (
            <Link to={urlString}>
              <button
                className="search-output-tile"
                id={item._id}
                value={item.listName}
                onClick={handleQuery}
              >
                {item.listName}
              </button>
            </Link>
          );
        })
        }
      </div>
    </div>
  );
}

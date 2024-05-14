import ReactDOM from "react-dom/client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MovieFilter from "./MovieFilter.js";
import MovieList from "./MovieList.js";

import { MovieCard } from "./MovieCard.js";
const Heading = () => {
  return (
    <>
      <h2 className="title">MOVIEFIX</h2>
    </>
  );
};

const Complete = () => {
  const [filterActive, setFilterActive] = useState(false);

  const handleFilterActive = (isActive) => {
    setFilterActive(isActive);
  };

  return (
    <div className="whole">
      <Heading></Heading>
      <MovieFilter onFilterActive={handleFilterActive} />
      {!filterActive && <MovieList />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Complete />);
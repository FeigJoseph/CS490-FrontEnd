import React, { useState, useEffect } from "react";

function Customers() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies data or perform any initialization
    fetch("/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        //console.log(data);
      });
  }, []);

  return (
    <div>
      <h1>Customers Page</h1>
      {/* Display movies or any other content */}
      {typeof movies.films === "undefined" ? (
        <p>Loading...</p>
      ) : (
        movies.films.map((film, i) => <p key={i}>{film}</p>)
      )}
    </div>
  );
}

export default Customers;

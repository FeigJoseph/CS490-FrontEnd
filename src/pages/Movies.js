import React, { useState, useEffect, useMemo } from "react";
import {
  BorderedCardDiv,
  TopBorderedCardDiv,
  TopCenteredCardDiv,
} from "./MoviesElements";
import Modal from "react-modal";

const Movies = () => {
  const [movies, setMovies] = useState({ films: [] });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchActor, setSearchActor] = useState("");

  const [rentMovie, setRentMovie] = useState("");
  const [movieCost, setMovieCost] = useState(0.0);
  const [genres, setGenres] = useState([]);

  const [showRented, setShowRented] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [enteredCustID, setEnteredCustID] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch("/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        //console.log(data);
      });
  }, []);

  useEffect(() => {
    fetch("/categories")
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.categories);
        //console.log(data);
      });
  }, []);

  const filteredMovies = movies.films.filter(
    (film) =>
      film[1].toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre === "" ||
        film[10].toLowerCase() === selectedGenre.toLowerCase()) &&
      (searchActor === "" ||
        (film[11] &&
          film[11].toLowerCase().includes(searchActor.toLowerCase())))
  );

  const handleRentClick = (film) => {
    setRentMovie(film[1]);
    setMovieCost(film[4]);
    setSelectedMovie(film);
    setModalIsOpen(true);
    console.log(rentMovie);
  };
  const handleModalClose = () => {
    setModalIsOpen(false);
  };
  const handleCustIDInput = (e) => {
    setEnteredCustID(e.target.value);
  };

  const handleClerkSubmit = (e) => {
    e.preventDefault();
    if (selectedMovie && enteredCustID !== "") {
      console.log(enteredCustID);
      const customerData = {
        customer_id: enteredCustID,
        movie: {
          id: selectedMovie[0],
          title: selectedMovie[1],
          cost: selectedMovie[4],
        },
      };
      fetch("/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Invalid customer ID");
          }
          return res.json();
        })
        .then((data) => {
          // Clear the form and customer info after submission
          if (data.customer && data.customer[0]) {
            alert("Rent successful");
            setModalIsOpen(false);
            setShowRented(true);
          } else {
            alert("Invalid customer ID");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Please enter a customer ID");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * moviesPerPage;
    return filteredMovies.slice(start, start + moviesPerPage);
  }, [currentPage, filteredMovies]);

  return (
    <div>
      {showRented && (
        <div>
          <h1>
            {rentMovie} has been rented for customer {enteredCustID}
          </h1>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1>Movies Page</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <label>Search Film: </label>
          <input
            type="text"
            placeholder="Film"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <label>Search Genre: </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All</option>
            {genres.map((genre) => (
              <option key={genre[0]} value={genre[0]}>
                {genre[0]}
              </option>
            ))}
          </select>

          <label>Search Actor: </label>
          <input
            type="text"
            placeholder="Actor"
            value={searchActor}
            onChange={(e) => setSearchActor(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2%",
            alignItems: "center",
            marginBottom: "1%",
          }}
        >
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)}>
              Previous Page
            </button>
          )}
          {currentPage * moviesPerPage < filteredMovies.length && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              Next Page
            </button>
          )}
        </div>

        {paginatedMovies.map((film) => (
          <BorderedCardDiv>
            <TopBorderedCardDiv>
              <strong>ID:{film[0]}</strong>
              <br />
              <TopCenteredCardDiv>
                <h2 style={{ marginTop: "0px" }}>{film[1]}</h2>
              </TopCenteredCardDiv>
              <br />
            </TopBorderedCardDiv>
            <strong
              style={{
                marginTop: "2%",
                fontSize: "150%",
                display: "block",
                textAlign: "center",
              }}
            >
              {film[6]}
            </strong>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  textAlign: "left",
                  marginLeft: "2%",
                  width: "48%",
                }}
              >
                <br />
                <br />
                <strong style={{ fontSize: "120%" }}>
                  Length: {film[7]} min
                </strong>
                <br />
                <br />
                <strong style={{ fontSize: "120%" }}>Rating: {film[2]}</strong>
                <br />
                <br />
                <strong style={{ fontSize: "120%" }}>Genre: {film[10]}</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button onClick={() => handleRentClick(film)}>Rent</button>
              </div>
              <div
                style={{
                  textAlign: "right",
                  width: "48%",
                  marginRight: "2%",
                }}
              >
                <br />
                <br />
                <strong style={{ fontSize: "120%" }}>
                  Released: {film[8]}
                </strong>
                <br />
                <br />
                <strong style={{ fontSize: "120%" }}>
                  Rent Rate: ${film[4]}
                </strong>
                <br />
                <br />
                <strong style={{ fontSize: "120%" }}>
                  Replacement Cost: ${film[9]}
                </strong>
              </div>
            </div>
          </BorderedCardDiv>
        ))}

        <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
          <div>
            <h2>Selected Movie: {selectedMovie ? selectedMovie[1] : ""}</h2>
            <form onSubmit={handleClerkSubmit}>
              <label>Customer ID:</label>
              <input
                type="text"
                value={enteredCustID}
                onChange={handleCustIDInput}
              />
              <button type="submit">Submit</button>
            </form>
            <button onClick={handleModalClose}>Close</button>
          </div>
          <div>
            <h1>Movie Cost: ${movieCost}</h1>
          </div>
        </Modal>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}
        >
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)}>
              Previous Page
            </button>
          )}
          {currentPage * moviesPerPage < filteredMovies.length && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              Next Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;

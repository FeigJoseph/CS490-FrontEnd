import React, { useState, useEffect, useMemo } from "react";
import {
  BorderedCardDiv,
  TopBorderedCardDiv,
  TopCenteredCardDiv,
} from "./MoviesElements";

const Movies = () => {
  const [movies, setMovies] = useState({ films: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [rentMovie, setRentMovie] = useState("");
  const [movieCost, setMovieCost] = useState(0.0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showRented, setShowRented] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [formError, setFormError] = useState("");

  // customer info
  const [firstName, setFirstName] = useState(""); // customer.first_name
  const [lastName, setLastName] = useState(""); // customer.last_name
  const [email, setEmail] = useState(""); // customer.email
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState(null);
  const [secCode, setSecCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

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
        film[10].toLowerCase() === selectedGenre.toLowerCase())
  );

  const handleRentClick = (film) => {
    setRentMovie(film[1]);
    setMovieCost(film[4]);
    setShowForm(true);
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();

    const newCustomer = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      address: streetAddress,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
      credit_card_number: creditCardNumber,
      security_code: secCode,
      movie: rentMovie,
      cost: movieCost,
    };

    fetch("/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("New customer added:", newCustomer);
        // Clear the form and customer info after submission
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding new customer:", error);
      });

    setShowRented(true);
  };

  const Form = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      handleCustomerSubmit(e);
      setShowForm(false);
    };

    return (
      <div>
        <br />
        <strong>{rentMovie}</strong>
        <form onSubmit={handleSubmit}>
          <br />
          <label>First Name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            onBlur={formValidation()}
          />

          <label>Last Name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <br />
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <label>Phone Number: </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <br />
          <br />
          <label>Street Address: </label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => {
              setStreetAddress(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <label>City: </label>
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <br />
          <label>State: </label>
          <input
            type="text"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <label>Country: </label>
          <input
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <label>Postal Code: </label>
          <input
            type="number"
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <br />
          <br />
          <label>Credit Card Number: </label>
          <input
            type="number"
            value={creditCardNumber}
            onChange={(e) => {
              setCreditCardNumber(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <label>Sec Code: </label>
          <input
            type="number"
            value={secCode}
            onChange={(e) => {
              setSecCode(e.target.value);
            }}
            onBlur={formValidation()}
          />
          <br />
          <br />
          <button type="submit" disabled={!formValid}>
            Submit
          </button>
          <br />
          <br />
        </form>
      </div>
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * moviesPerPage;
    return filteredMovies.slice(start, start + moviesPerPage);
  }, [currentPage, filteredMovies]);

  const formValidation = () => {
    if (firstName == "") {
      setFormError("First Name is blank");
    } else if (lastName == "") {
      setFormError("Last Name is blank");
    } else if (email == "") {
      setFormError("Email is blank");
    } else if (phoneNumber == "") {
      setFormError("Phone Number is blank");
    } else if (phoneNumber.length != 10) {
      setFormError("Phone Number must be 10 numbers");
    } else if (streetAddress == "") {
      setFormError("Street Address is blank");
    } else if (city == "") {
      setFormError("City is blank");
    } else if (state == "") {
      setFormError("State is blank");
    } else if (country == "") {
      setFormError("Country is blank");
    } else if (postalCode == "") {
      setFormError("Postal Code is blank");
    } else if (creditCardNumber == "") {
      setFormError("Credit Card Number is blank");
    } else if (creditCardNumber.length != 16) {
      setFormError("Credit Card Number must be 16 numbers");
    } else if (secCode == "") {
      setFormError("Sec Code is blank");
    } else if (secCode.length != 3) {
      setFormError("Sec Code must be 3 numbers");
    } else {
      setFormError("");
    }
    setFormValid(
      firstName != "" &&
        lastName != "" &&
        email != "" &&
        phoneNumber != "" &&
        phoneNumber.length == 10 &&
        streetAddress != "" &&
        city != "" &&
        state != "" &&
        country != "" &&
        postalCode != "" &&
        creditCardNumber != "" &&
        creditCardNumber.length == 16 &&
        secCode != "" &&
        secCode.length == 3
    );
  };

  return (
    <div>
      {showRented && (
        <div>
          <h1>Your movie has been rented!</h1>
        </div>
      )}
      {formError != "" && (
        <div>
          <p style={{ color: "red" }}>{formError}</p>
        </div>
      )}
      {showForm && <Form />}

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

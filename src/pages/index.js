// Homepage.js

import React, { useEffect, useState } from "react";
import {
  PageTitle,
  Top5Div,
  FloatLeftDiv,
  StyledTable,
  StyledTd,
  StyledTh,
  BorderedCardDiv,
  TopBorderedCardDiv,
  TopCenteredCardDiv,
} from "./IndexElements";

function Homepage() {
  const [topFilms, setTopFilms] = useState([{}]);
  useEffect(() => {
    fetch("/topMovies")
      .then((res) => res.json())
      .then((data) => {
        setTopFilms(data);
        console.log(data);
      });
  }, []);

  const [topActors, setTopActors] = useState([{}]);
  useEffect(() => {
    fetch("/topActors")
      .then((res) => res.json())
      .then((data) => {
        setTopActors(data);
        //console.log(data);
      });
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const [selectedActor, setSelectedActor] = useState(null);
  const [topMoviesForActor, setTopMoviesForActor] = useState([]);

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    fetch(`/topMoviesForActor?actorId=${actor[0]}`)
      .then((res) => res.json())
      .then((data) => {
        setTopMoviesForActor(data.films);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching top movies for actor:", error);
      });
  };

  return (
    <div>
      <PageTitle>
        <h1>Homepage</h1>
      </PageTitle>
      <Top5Div>
        <FloatLeftDiv>
          <h2>Top 5 Rented Movies:</h2>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh>ID</StyledTh>
                <StyledTh>Title</StyledTh>
                <StyledTh>Rating</StyledTh>
                <StyledTh>Rent Period</StyledTh>
                <StyledTh>Rent Price</StyledTh>
                <StyledTh>Rent Count</StyledTh>
              </tr>
            </thead>
            <tbody>
              {topFilms.films?.map((film) => (
                <tr key={film[0]} onClick={() => handleMovieClick(film)}>
                  <StyledTd key={film[0]}>{film[0]}</StyledTd>
                  <StyledTd key={film[0]}>{film[1]}</StyledTd>
                  <StyledTd key={film[0]}>{film[2]}</StyledTd>
                  <StyledTd key={film[0]}>{film[3]}</StyledTd>
                  <StyledTd key={film[0]}>${film[4]}</StyledTd>
                  <StyledTd key={film[0]}>{film[5]}</StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </FloatLeftDiv>
        {selectedMovie && (
          <FloatLeftDiv>
            <h1>Movie Details:</h1>
            <BorderedCardDiv>
              <TopBorderedCardDiv>
                <strong>ID:{selectedMovie[0]}</strong>
                <br />
                <TopCenteredCardDiv>
                  <h2 style={{ marginTop: "0px" }}>{selectedMovie[1]}</h2>
                </TopCenteredCardDiv>
                <br />
              </TopBorderedCardDiv>
              <strong
                style={{
                  marginTop: "5%",
                  fontSize: "150%",
                  display: "block",
                  textAlign: "center",
                }}
              >
                {selectedMovie[6]}
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
                    Length: {selectedMovie[7]} min
                  </strong>
                  <br />
                  <br />
                  <strong style={{ fontSize: "120%" }}>
                    Rating: {selectedMovie[2]}
                  </strong>
                  <br />
                  <br />
                  <strong style={{ fontSize: "120%" }}>
                    Released: {selectedMovie[8]}
                  </strong>
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
                    Rent Period: {selectedMovie[3]}
                  </strong>
                  <br />
                  <br />
                  <strong style={{ fontSize: "120%" }}>
                    Rent Rate: ${selectedMovie[4]}
                  </strong>
                  <br />
                  <br />
                  <strong style={{ fontSize: "120%" }}>
                    Replacement Cost: ${selectedMovie[9]}
                  </strong>
                </div>
              </div>
            </BorderedCardDiv>
          </FloatLeftDiv>
        )}
      </Top5Div>

      <div>
        <Top5Div>
          <FloatLeftDiv>
            <h2>Top 5 Actors:</h2>
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>First Name</StyledTh>
                  <StyledTh>Last Name</StyledTh>
                  <StyledTh>Movie Count</StyledTh>
                </tr>
              </thead>
              <tbody>
                {topActors.actors?.map((actor) => (
                  <tr key={actor[0]} onClick={() => handleActorClick(actor)}>
                    <StyledTd key={actor[0]}>{actor[1]}</StyledTd>
                    <StyledTd key={actor[0]}>{actor[2]}</StyledTd>
                    <StyledTd key={actor[0]}>{actor[3]}</StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </FloatLeftDiv>
          {selectedActor && (
            <FloatLeftDiv style={{ marginTop: "2%" }}>
              <h1 style={{ marginBottom: "0px" }}>Actor Details:</h1>
              <div>
                <h2>
                  {selectedActor[1]} {selectedActor[2]}
                </h2>
                <h3>Top 5 Movies:</h3>

                <ul>
                  {topMoviesForActor.map((movie) => (
                    <li key={movie[0]}>{movie[1]}</li>
                  ))}
                </ul>
              </div>
            </FloatLeftDiv>
          )}
        </Top5Div>
      </div>
    </div>
  );
}

export default Homepage;

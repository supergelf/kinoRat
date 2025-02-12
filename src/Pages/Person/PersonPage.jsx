import { useLocation } from "react-router-dom";
import "./PersonPage.css";
import { useEffect, useState } from "react";

import arrowIcon from "/arrowIcon.svg";
import MovieCard from "../../Components/MovieCard/MovieCard";
import MovieCardPersonPage from "./MovieCardPersonPage";

function PersonPage() {
  const location = useLocation();
  const personID = location.state;

  const [personDetails, setPersonDetails] = useState();
  const [personCrewCredits, setPersonCrewCredits] = useState({});
  const [personCastCredits, setPersonCastCredits] = useState({});

  const [genreList, setGenreList] = useState({});

  const [activeCreditFilter, setActiveCreditFilter] = useState("...");
  const [activeGenreFilter, setActiveGenreFilter] = useState("Genre");

  const [activeSorting, setActiveSorting] = useState("Popularity");
  const [actualActiveSorting, setActualActiveSorting] = useState("Popularity");

  const [activeFilms, setActiveFilms] = useState([]);

  const [showBio, setShowBio] = useState(false);
  const [isCreditDropdownShow, setIsCreditDropdownShow] = useState(false);
  const [isSortingDropdownShow, setIsSortingDropDownShow] = useState(false);
  const [isGenreDropdownShow, setIsGenreDropdownShow] = useState(false);

  const [doneLoading, setDoneLoading] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWVhYzg5OTM4OGZmMTQxYzU5N2U0MWFiNTBkYjMzYSIsInN1YiI6IjY2MDAwYTJmNDU5YWQ2MDE2NGY4NTFiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VRSuwwxjrdMmPU0O2hWAkuDgTO1KCMI8YNWj7JAlXxI",
    },
  };

  useEffect(() => {
    //Get person details
    const urlDetails = `https://api.themoviedb.org/3/person/${personID}?language=en-US`;
    const fetchPersonDetails = async () => {
      await fetch(urlDetails, options)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          setPersonDetails(json);
        })
        .catch((err) => console.error("error:" + err));
    };

    fetchPersonDetails();
  }, []);

  useEffect(() => {
    let newGenreList = [];

    const urlGenreList = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    fetch(urlGenreList, options)
      .then((res) => res.json())
      .then((json) => {
        newGenreList = json.genres;
        console.log(newGenreList);
      })
      .catch((err) => console.error("error:" + err));

    //Get person movie credits
    const urlCredits = `https://api.themoviedb.org/3/person/${personID}/movie_credits?language=en-US`;

    const fetchPersonCredits = async () => {
      await fetch(urlCredits, options)
        .then((res) => res.json())
        .then((json) => {
          let personJobs = {};
          console.log(json);

          json?.crew.forEach((cred) => {
            if (!personJobs[cred.job]) {
              personJobs[cred.job] = [];
            }

            personJobs[cred.job].push(cred);

            cred.genre_ids.forEach((genreId) => {
              newGenreList.forEach((genre) => {
                if (Object.values(genre)[0] == genreId && !Object.values(genreList).includes(Object.values(genre)[1])) {
                  genreList[genreId] = Object.values(genre)[1];
                }
              });
            });
          });

          json?.cast.forEach((cred) => {
            if (!personJobs["Actor"]) {
              personJobs["Actor"] = [];
            }

            personJobs["Actor"].push(cred);

            cred.genre_ids.forEach((genreId) => {
              newGenreList.forEach((genre) => {
                if (Object.values(genre)[0] == genreId && !Object.values(genreList).includes(Object.values(genre)[1])) {
                  genreList[genreId] = Object.values(genre)[1];
                }
              });
            });
          });

          console.log(personJobs);
          if (personJobs["Thanks"]) {
            delete personJobs["Thanks"];
          }

          let profession = "";

          if (personDetails.known_for_department == "Directing") {
            if (personJobs["Director"]) {
              profession = "Director";
            } else if (personJobs["Co-Director"]) {
              profession = "Co-Director";
            } else {
              profession = Object.keys(personJobs)[0];
            }
          } else if (personDetails.known_for_department == "Acting") {
            profession = "Actor";
          } else if (personDetails.known_for_department == "Writing") {
            if (personJobs["Screenplay"]) {
              profession = "Screenplay";
            } else if (personJobs["Writer"]) {
              profession = "Writer";
            } else if (personJobs["Story"]) {
              profession = "Story";
            } else {
              profession = Object.keys(personJobs)[0];
            }
          } else if (personDetails.known_for_department == "Production") {
            if (personJobs["Producer"]) {
              profession = "Producer";
            } else if (personJobs["Executive Producer"]) {
              profession = "Executive Producer";
            } else if (personJobs["Co-Executive Producer"]) {
              profession = "Co-Executive Producer";
            } else {
              profession = Object.keys(personJobs)[0];
            }
          } else if (personDetails.known_for_department == "Editing") {
            if (personJobs["Editor"]) {
              profession = "Editor";
            } else if (personJobs["Assistant Editor"]) {
              profession = "Assistant Editor";
            } else {
              profession = Object.keys(personJobs)[0];
            }
          } else if (personDetails.known_for_department == "Camera") {
            if (personJobs["Director of Photography"]) {
              profession = "Director of Photography";
            } else if (personJobs["Additional Photography"]) {
              profession = "Additional Photography";
            } else {
              profession = Object.keys(personJobs)[0];
            }
          } else if (personDetails.known_for_department == "Sound") {
            if (personJobs["Original Music Composer"]) {
              profession = "Original Music Composer";
            } else if (personJobs["Composer"]) {
              profession = "Composer";
            } else if (personJobs["Music"]) {
              profession = "Music";
            } else {
              profession = Object.keys(personJobs)[0];
            }
          } else {
            profession = Object.keys(personJobs)[0];
          }

          let sortedJobs = sortFilmsByOption(personJobs[profession], actualActiveSorting);

          setGenreList(genreList);
          setActiveFilms(sortedJobs);
          setActiveCreditFilter(profession);

          setPersonCrewCredits(personJobs);
          setDoneLoading(true);
        })
        .catch((err) => console.error("error:" + err));
    };

    if (personDetails) {
      fetchPersonCredits();
    }
  }, [personDetails]);

  const changeBioDisplay = () => {
    setShowBio(!showBio);
  };

  const showCreditDropdown = () => {
    setIsCreditDropdownShow(true);
  };

  const hideCreditDropdown = () => {
    setIsCreditDropdownShow(false);
  };

  const sortFilmsByPopularity = (films) => {
    return films.sort((a, b) => b.popularity - a.popularity);
  };

  const changeActiveCredit = (e, credit) => {
    e.preventDefault();
    setActiveCreditFilter(credit);
    let sortedJobs = sortFilmsByOption(personCrewCredits[credit], actualActiveSorting);

    setActiveFilms(sortedJobs);
    hideCreditDropdown();
  };

  const changeGenreFilter = (e, genre) => {
    e.preventDefault();
    setActiveGenreFilter(genre);
    hideGenreDropdown();
  };

  const showGenreDropdown = () => {
    setIsGenreDropdownShow(true);
  };

  const hideGenreDropdown = () => {
    setIsGenreDropdownShow(false);
  };

  const hideSortingDropdown = () => {
    setIsSortingDropDownShow(false);
  };

  const showSortingDropdown = () => {
    setIsSortingDropDownShow(true);
  };

  const sortFilmsByOption = (films, option) => {
    if (option == "Film Name") {
      return films.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option == "Longest First") {
      return sortFilmsByPopularity(films);
    } else if (option == "Shortest First") {
      return sortFilmsByPopularity(films);
    } else if (option == "Newest First") {
      return films.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (option == "Oldest First") {
      return films.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    } else if (option == "Highest First") {
      return films.sort((a, b) => b.vote_average - a.vote_average);
    } else if (option == "Lowest First") {
      return films.sort((a, b) => a.vote_average - b.vote_average);
    } else if (option == "Popularity") {
      return sortFilmsByPopularity(films);
    }
  };

  const changeSorting = (e, newSort, actualSort) => {
    e.preventDefault();
    setActiveSorting(newSort);
    setActualActiveSorting(actualSort);

    let sortedJobs = sortFilmsByOption(personCrewCredits[activeCreditFilter], actualSort);

    setActiveFilms(sortedJobs);
    hideSortingDropdown();
  };

  return (
    <div className="personPageWrapper">
      <div className="personPageRoot">
        <div className="personPageInfoBox">
          {personDetails?.profile_path && (
            <div className="personPageImageWrapper">
              <img className="personPageImage" src={`https://image.tmdb.org/t/p/h632${personDetails.profile_path}`} />
            </div>
          )}
          {personDetails?.biography && (
            <p className="personPageBio">
              {showBio ? personDetails?.biography : personDetails?.biography.split(" ").slice(0, 40).join(" ") + "..."}
              <span className="personPageBioShowOrHide" onClick={changeBioDisplay}>
                {showBio ? "less" : "more"}
              </span>
            </p>
          )}
        </div>

        <div className="personPageCreditBox">
          <h1 className="personPageName">{personDetails ? personDetails.name : "Loading name..."}</h1>
          <div className="personPageFilterSort">
            <div className="personPageFilterCredit" onClick={showCreditDropdown}>
              <p className="personPageActiveCredit">{activeCreditFilter}</p>
              <img className="personPageFilterArrow" src={arrowIcon} />
            </div>
            <div
              className={
                isCreditDropdownShow ? "personPageFilterCreditDropdown" : "personPageFilterCreditDropdownHidden"
              }
            >
              <div className="personPageFilterActiveDropdown" onClick={hideCreditDropdown}>
                <p className="personPageFilterActiveDropdownText">{activeCreditFilter}</p>
                <img className="personPageFilterArrow" src={arrowIcon} />
              </div>
              {Object.keys(personCrewCredits).map((cred) => {
                return (
                  <p
                    className={
                      cred == activeCreditFilter
                        ? "personPageFilterDropdownOptionDisable"
                        : "personPageFilterDropdownOption"
                    }
                    onClick={(e) => changeActiveCredit(e, cred)}
                    key={cred}
                  >
                    {cred}
                  </p>
                );
              })}
            </div>

            <div className="personPageFilterRest">
              <div className="personPageFilterRestBoxGenre">
                <div className="personPageActiveGenreBox" onClick={showGenreDropdown}>
                  <p className="personPageActiveFilter">{activeGenreFilter}</p>
                  <img className="personPageFilterArrow" src={arrowIcon} />
                </div>
                <div className={isGenreDropdownShow ? "personPageGenreDropdown" : "personPageGenreDropdownHidden"}>
                  <div className="personPageGenreFilterActiveBox" onClick={hideGenreDropdown}>
                    <p className="personPageGenreActiveFilterText">{activeGenreFilter}</p>
                    <img className="personPageFilterArrow" src={arrowIcon} />
                  </div>
                  <p
                    className={
                      activeGenreFilter == "Genre"
                        ? "personPageDropDownGenreOptionActive"
                        : "personPageDropDownGenreOption"
                    }
                    onClick={(e) => changeGenreFilter(e, "Genre")}
                  >
                    All genres
                  </p>
                  {Object.values(genreList).length != 0 &&
                    Object.values(genreList).map((genre) => {
                      return (
                        <p
                          className={
                            activeGenreFilter == genre
                              ? "personPageDropDownGenreOptionActive"
                              : "personPageDropDownGenreOption"
                          }
                          key={genre}
                          onClick={(e) => changeGenreFilter(e, genre)}
                        >
                          {genre}
                        </p>
                      );
                    })}
                </div>
              </div>
              <div className="personPageFilterRestBoxSort">
                <p className="personPageSortBy">Sort by</p>
                <div className="personPageActiveSortBox" onClick={showSortingDropdown}>
                  <p className="personPageActiveSort">{activeSorting.toUpperCase()}</p>
                  <img className="personPageFilterArrow" src={arrowIcon} />
                </div>
              </div>

              <div className={isSortingDropdownShow ? "personPageSortDropdown" : "personPageSortDropdownHidden"}>
                <div className="personPageSortActiveDropdown" onClick={hideSortingDropdown}>
                  <p className="personPageSortDropdownActiveText">{activeSorting.toUpperCase()}</p>
                  <img className="personPageSortArrow" src={arrowIcon} />
                </div>

                <ul className="personPageSortDropdownOptions">
                  <li
                    className={
                      actualActiveSorting == "Popularity"
                        ? "personPageSortDropdownOptionActive"
                        : "personPageSortDropdownOption"
                    }
                    onClick={(e) => changeSorting(e, "Popularity", "Popularity")}
                  >
                    Popularity
                  </li>
                  <li
                    className={
                      actualActiveSorting == "Film Name"
                        ? "personPageSortDropdownOptionActive"
                        : "personPageSortDropdownOption"
                    }
                    onClick={(e) => changeSorting(e, "Film Name", "Film Name")}
                  >
                    Film Name
                  </li>
                  <li className="personPageSortDropdownOptionHeader">
                    Film Length
                    <ul className="personPageSortDropdownSubOptions">
                      <li
                        className={
                          actualActiveSorting == "Longest First"
                            ? "personPageSortDropdownOptionActive"
                            : "personPageSortDropdownOption"
                        }
                        onClick={(e) => changeSorting(e, "Film Length", "Longest First")}
                      >
                        Longest First
                      </li>
                      <li
                        className={
                          actualActiveSorting == "Shortest First"
                            ? "personPageSortDropdownOptionActive"
                            : "personPageSortDropdownOption"
                        }
                        onClick={(e) => changeSorting(e, "Film Length", "Shortest First")}
                      >
                        Shortest First
                      </li>
                    </ul>
                  </li>
                  <li className="personPageSortDropdownOptionHeader">
                    Release Date
                    <ul className="personPageSortDropdownSubOptions">
                      <li
                        className={
                          actualActiveSorting == "Newest First"
                            ? "personPageSortDropdownOptionActive"
                            : "personPageSortDropdownOption"
                        }
                        onClick={(e) => changeSorting(e, "Release Date", "Newest First")}
                      >
                        Newest First
                      </li>
                      <li
                        className={
                          actualActiveSorting == "Oldest First"
                            ? "personPageSortDropdownOptionActive"
                            : "personPageSortDropdownOption"
                        }
                        onClick={(e) => changeSorting(e, "Release Date", "Oldest First")}
                      >
                        Oldest First
                      </li>
                    </ul>
                  </li>
                  <li className="personPageSortDropdownOptionHeader">
                    Average Rating
                    <ul className="personPageSortDropdownSubOptions">
                      <li
                        className={
                          actualActiveSorting == "Highest First"
                            ? "personPageSortDropdownOptionActive"
                            : "personPageSortDropdownOption"
                        }
                        onClick={(e) => changeSorting(e, "Average Rating", "Highest First")}
                      >
                        Highest First
                      </li>
                      <li
                        className={
                          actualActiveSorting == "Lowest First"
                            ? "personPageSortDropdownOptionActive"
                            : "personPageSortDropdownOption"
                        }
                        onClick={(e) => changeSorting(e, "Average Rating", "Lowest First")}
                      >
                        Lowest First
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="personPageFilmBox">
            {doneLoading &&
              activeFilms.map((film) => {
                return <MovieCardPersonPage movie={film} key={film.id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonPage;

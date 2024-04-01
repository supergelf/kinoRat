import { useLocation, useNavigate } from "react-router-dom";
import "./FilmPage.css";
import { useEffect, useState } from "react";

import unratedStar from "/unratedStar.svg";
import ratedStar from "/ratedStar.svg";
import uncheckedBox from "/checkBox/uncheckedBox.svg";
import checkedBox from "/checkBox/checkedBox.svg";
import bookmarkIcon from "/bookmarkIcon.svg";

function FilmPage() {
  const location = useLocation();
  const movieId = location.state;

  const navigate = useNavigate();

  const [filmData, setFilmData] = useState();
  const [filmCredits, setFilmCredits] = useState();
  const [filmCrew, setFilmCrew] = useState();
  const [filmDetails, setFilmDetails] = useState();
  const [filmTrailers, setFilmTrailers] = useState([]);

  const [watchOptions, setWatchOptions] = useState();
  const [watchProviderImages, setWatchProviderImages] = useState();

  const [filmLoading, setFilmLoading] = useState(true);

  const [activeChoose, setActiveChoose] = useState("Cast");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hasCheckedBox, setHasCheckedBox] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    console.log(movieId);
    const urlMov = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWVhYzg5OTM4OGZmMTQxYzU5N2U0MWFiNTBkYjMzYSIsInN1YiI6IjY2MDAwYTJmNDU5YWQ2MDE2NGY4NTFiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VRSuwwxjrdMmPU0O2hWAkuDgTO1KCMI8YNWj7JAlXxI",
      },
    };

    const getFilm = async () => {
      await fetch(urlMov, options)
        .then((res) => res.json())
        .then((json) => {
          setFilmData(json);

          const linesToInclude = [
            "production_companies",
            "Studio",
            "production_countries",
            "Country",
            "release_date",
            "Release Date",
            "original_title",
            "Original Title",
            "original_language",
            "Orig. Language",
          ];

          let linesInc = {};

          Object.entries(json).forEach(([key, value]) => {
            let newKey = key;

            if (newKey == "production_countries") {
              newKey = "Country";
            } else if (newKey == "production_companies") {
              newKey = "Studio";
            } else if (newKey == "release_date") {
              newKey = "Release Date";
            } else if (newKey == "original_title") {
              newKey = "Original Title";
            } else if (newKey == "original_language") {
              newKey = "Orig. Language";
            }

            if (linesToInclude.includes(newKey)) {
              if (!linesInc[newKey]) {
                linesInc[newKey] = [];
              }

              linesInc[newKey].push(value);
            }
          });

          Object.keys(linesInc)
            .sort((a, b) => {
              return linesToInclude.indexOf(a) - linesToInclude.indexOf(b);
            })
            .forEach((key) => {
              let value = linesInc[key];
              delete linesInc[key];
              linesInc[key] = value;
            });

          setFilmDetails(linesInc);
        })
        .catch((err) => console.error("error:" + err));
    };

    getFilm();

    const urlCred = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;

    fetch(urlCred, options)
      .then((res) => res.json())
      .then((json) => {
        setFilmCredits(json);

        const jobsToInclude = [
          "Director",
          "Assistant Director",
          "Asst. Director",
          "Writer",
          "Screenplay",
          "Original Story",
          "Original Writer",
          "Novel",
          "Producer",
          "Executive Producer",
          "Exec. Producer",
          "Composer",
          "Original Music Composer",
          "Director of Photography",
          "Cinematography",
          "Editor",
          "Visual Effects",
        ];

        let crew = json.crew.reduce((roles, person) => {
          let key = person.job;

          if (key == "Director of Photography") {
            key = "Cinematography";
          } else if (key == "Original Music Composer") {
            key = "Composer";
          } else if (key == "Novel") {
            key = "Original Writer";
          } else if (key == "Screenplay") {
            key = "Writer";
          } else if (key == "Executive Producer") {
            key = "Exec. Producer";
          } else if (key == "Assistant Director") {
            key = "Asst. Director";
          }

          if (jobsToInclude.includes(key)) {
            if (!roles[key]) {
              roles[key] = [];
            }

            if (!roles[key].some((p) => p.id == person.id)) {
              roles[key].push(person);
            }
          }
          return roles;
        }, {});

        crew = Object.entries(crew).sort((a, b) => jobsToInclude.indexOf(a[0]) - jobsToInclude.indexOf(b[0]));

        setFilmCrew(crew);
      })
      .catch((err) => console.error("error:" + err));

    const urlWatch = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

    fetch(urlWatch, options)
      .then((res) => res.json())
      .then((json) => {
        if (json.results.NO) {
          let availability = {};
          let providerImages = {};

          Object.entries(json.results.NO).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((obj) => {
                const providerName = obj.provider_name;
                const providerLogo = obj.logo_path;
                const displayPriority = obj.display_priority;

                if (providerName) {
                  let newKey = key;
                  if (newKey == "flatrate") {
                    newKey = "sub";
                  }
                  if (!availability.hasOwnProperty(providerName)) {
                    availability[providerName] = { keys: [newKey], displayPriority };
                  } else {
                    if (!availability[providerName].keys.includes(newKey)) {
                      availability[providerName].keys.push(newKey);
                    }
                  }

                  if (providerLogo) {
                    if (!providerImages.hasOwnProperty(providerName)) {
                      providerImages[providerName] = providerLogo;
                    }
                  }
                }
              });
            }
          });

          let sortedAvailability = Object.entries(availability).sort(
            (a, b) => a[1].displayPriority - b[1].displayPriority
          );

          setWatchOptions(sortedAvailability);
          setWatchProviderImages(providerImages);
        }
      })
      .catch((err) => console.error("error:" + err));

    const urlTrailers = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;

    fetch(urlTrailers, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json.results);

        json.results.forEach((vid) => {
          vid.type == ("Trailer" || "Teaser") && filmTrailers.push(vid);
        });

        setFilmTrailers([...filmTrailers]);
      })
      .catch((err) => console.error("error:" + err));

    setFilmLoading(false);
  }, []);

  const changeActiveChoose = (e, chosen) => {
    e.preventDefault();
    setActiveChoose(chosen);
  };

  const StarArray = () => {
    const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
      <div className="filmPageStarArray">
        {stars.map((star) => {
          return (
            <img
              className="filmPageStar"
              src={star <= hoveredStar ? ratedStar : unratedStar}
              onMouseOver={() => setHoveredStar(star)}
              onMouseOut={() => setHoveredStar(star)}
              key={star}
            />
          );
        })}
      </div>
    );
  };

  const changeCheckBox = () => {
    if (hasCheckedBox) {
      setHasCheckedBox(false);
    } else {
      setHasCheckedBox(true);
    }
  };

  const openPersonPage = (e, person) => {
    e.preventDefault();
    console.log(person.id);

    const personURL = person.name.split(" ").join("-").toLowerCase();
    navigate(`/person/${personURL}`, { state: person.id });
  };

  return (
    <div className="filmPageWrapper">
      <div className="filmPageRoot">
        {!filmLoading && filmData && (
          <>
            <div className="filmPageBackdropWrapper">
              {filmData.backdrop_path && (
                <div
                  className="filmPageBackdropContainer"
                  style={{
                    backgroundImage: `url(${`https://image.tmdb.org/t/p/w1280${filmData.backdrop_path}`})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="filmPageFadeOverlay"></div>
                </div>
              )}
            </div>

            <div className={filmData.backdrop_path ? "filmPageInfo" : "filmPageInfoNoBackdrop"}>
              <div className="filmPageBox1">
                {filmData.poster_path && (
                  <div className="filmPagePosterWrapper">
                    <img
                      className="filmPagePoster"
                      src={`https://image.tmdb.org/t/p/w500${filmData.poster_path}`}
                      alt="Film Poster"
                    />
                  </div>
                )}

                <div className="filmPageRatingWatchlist">
                  <div className="filmPageRatingWatch">
                    <div className="filmPageRatingWatchWrapper">
                      <img className="filmPageRatingWatchStar" src={ratedStar} />
                      <p className="filmPageRatingWatchText">{filmData.vote_average.toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="filmPageWatchlist">
                    <p className="filmPageWatchlistText">Add to watchlist</p>
                    <img className="filmPageWatchlistBookmark" src={bookmarkIcon} />
                  </div>
                </div>

                <div className="filmPageWhereToWatch">
                  <div className="filmPageWhereToWatchTitleWrapper">
                    <p className="filmPageWhereToWatchTitle">Available on</p>
                  </div>
                  {!watchOptions && (
                    <div className="filmPageWhereToWatchOptionLast">
                      <p className="filmPageWhereToWatchCompany">Not available for streaming</p>
                    </div>
                  )}
                  {watchOptions &&
                    watchOptions.map((company, index, array) => (
                      <div
                        className={
                          index == array.length - 1 ? "filmPageWhereToWatchOptionLast" : "filmPageWhereToWatchOption"
                        }
                        key={company[0]}
                      >
                        <div className="filmPageWhereToWatchImageWrapper">
                          <img
                            className="filmPageWhereToWatchImage"
                            src={`https://image.tmdb.org/t/p/w154${watchProviderImages[company[0]]}`}
                          />
                        </div>
                        <p className="filmPageWhereToWatchCompany">{company[0]}</p>
                        <div className="filmPageWhereToWatchTypeWrapper">
                          {company[1].keys.map((option) => (
                            <p className="filmPageWhereToWatchType" key={company[0] + "" + option}>
                              {option.toUpperCase()}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  <div className="filmPageJustWatch">
                    <p className="filmPageJustWatchTitle">Powered by</p>
                    <a
                      className="filmPageJustWatchLink"
                      target="_blank"
                      data-original="https://www.justwatch.com"
                      href={`https://www.justwatch.com/no/movie/${filmData.title
                        .replaceAll(":", "")
                        .replaceAll(" ", "-")
                        .toLowerCase()}`}
                    >
                      <img
                        className="filmPageJustWatchLogo"
                        alt="JustWatch"
                        src="https://widget.justwatch.com/assets/JW_logo_color_10px.svg"
                      ></img>
                    </a>
                  </div>
                </div>
              </div>
              <div className="filmPageBox2">
                <h1 className="filmPageTitle">{filmData.title}</h1>
                <div className="filmPageYearAndTime">
                  <p className="filmPageYearAndTimeText">{filmData.release_date.split("-")[0]}</p>
                  <p className="filmPageYearAndTimeText">•</p>
                  <div className="filmPageTime">
                    <p className="filmPageYearAndTimeText">
                      {Math.floor(filmData.runtime / 60) > 0 && Math.floor(filmData.runtime / 60).toString() + `h`}
                    </p>
                    <p className="filmPageYearAndTimeText">
                      {filmData.runtime % 60 > 0 && (filmData.runtime % 60).toString() + `m`}
                    </p>
                  </div>
                  {filmTrailers.length != 0 && (
                    <>
                      <p className="filmPageYearAndTimeText">•</p>
                      <a
                        className="filmPageTrailerLink"
                        href={`https://www.youtube.com/watch?v=${filmTrailers[0].key}`}
                        target="_blank"
                      >
                        Play trailer
                      </a>
                    </>
                  )}
                </div>
                {filmData.tagline.length != 0 && <p className="filmPageTagline">"{filmData.tagline}"</p>}
                <p className="filmPagePlot">{filmData.overview}</p>

                <div className="filmPageDivAndRating">
                  <div className="filmPageDivInfo">
                    {filmData.genres && (
                      <div className="filmPageGenreBox">
                        <p className="filmPageRatingDiagramTitle">Genres</p>
                        <div className="filmPageGenres">
                          {filmData.genres.map((genre) => (
                            <p className="filmPageOptionContentChildDetails" key={genre.id}>
                              {genre.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="filmPageRateBox">
                    <div className="filmPageRating">
                      <p className="filmPageRateTitle">Rate and review</p>
                      <StarArray />
                    </div>

                    <div className="filmPageReviewBox">
                      <textarea className="filmPageReviewText" placeholder="Write a review..." maxLength={600} />
                    </div>
                    <div className="filmPageSubmitReviewBox">
                      <div className="filmPageReviewWatchedDateBox">
                        <img
                          className="filmPageReviewWatchedCheckbox"
                          src={hasCheckedBox ? checkedBox : uncheckedBox}
                          onClick={changeCheckBox}
                        />
                        <p className="filmPageReviewWatchedDate">Watched today</p>
                      </div>
                      <button className="filmPageSubmitReviewButton">Save</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="filmPageBox3">
                <div className="filmPageChooseRow">
                  <p
                    className={activeChoose == "Cast" ? "filmPageChooseOptionActive" : "filmPageChooseOption"}
                    onClick={(e) => changeActiveChoose(e, "Cast")}
                  >
                    Cast
                  </p>
                  <p
                    className={activeChoose == "Crew" ? "filmPageChooseOptionActive" : "filmPageChooseOption"}
                    onClick={(e) => changeActiveChoose(e, "Crew")}
                  >
                    Crew
                  </p>
                  <p
                    className={activeChoose == "Details" ? "filmPageChooseOptionActive" : "filmPageChooseOption"}
                    onClick={(e) => changeActiveChoose(e, "Details")}
                  >
                    Details
                  </p>
                </div>

                <div className="filmPageOptionContent">
                  {filmCredits &&
                    activeChoose == "Cast" &&
                    filmCredits.cast.slice(0, 30).map((p) => {
                      return (
                        <p className="filmPageOptionContentChild" key={p.id} onClick={(e) => openPersonPage(e, p)}>
                          {p.name}
                        </p>
                      );
                    })}
                  {filmCrew && activeChoose == "Crew" && (
                    <div className="filmPageCrewContainer">
                      {filmCrew.map((job) => {
                        return (
                          <div className="filmPageCrewChild" key={job[0]}>
                            <p className="filmPageCrewRole">
                              <span>{job[0].toUpperCase()}</span>
                            </p>
                            <div className="filmPageCrewNames">
                              {job[1].map((p) => {
                                return (
                                  <p
                                    className="filmPageOptionContentChild"
                                    key={p.id}
                                    onClick={(e) => openPersonPage(e, p)}
                                  >
                                    {p.name}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {filmDetails && activeChoose == "Details" && (
                    <div className="filmPageCrewContainer">
                      {Object.entries(filmDetails).map(([key, value]) => {
                        if (value == "") {
                          return;
                        }
                        return (
                          <div className="filmPageCrewChild" key={key}>
                            <p className="filmPageDetail">
                              <span>{key.toUpperCase()}</span>
                            </p>
                            <div className="filmPageCrewNames">
                              {value.map((p, index) => {
                                return (
                                  <p className="filmPageOptionContentChildDetails" key={index}>
                                    {p[0] && p[0].name ? p[0].name : p}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FilmPage;

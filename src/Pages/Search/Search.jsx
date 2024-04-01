import { useEffect, useState } from "react";
import "./Search.css";
import { useLocation, useNavigate } from "react-router-dom";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchInput = location.state;

  const [matchingFilms, setMatchingFilms] = useState([]);
  const [matchingPeople, setMatchingPeople] = useState([]);

  const [genreList, setGenreList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Films");

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWVhYzg5OTM4OGZmMTQxYzU5N2U0MWFiNTBkYjMzYSIsInN1YiI6IjY2MDAwYTJmNDU5YWQ2MDE2NGY4NTFiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VRSuwwxjrdMmPU0O2hWAkuDgTO1KCMI8YNWj7JAlXxI",
      },
    };

    const urlSearch = `https://api.themoviedb.org/3/search/movie?query=${searchInput}&include_adult=false&language=en-US&page=1`;
    fetch(urlSearch, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        let sortedFilms = json.results.sort((a, b) => b.popularity - a.popularity);
        setMatchingFilms(sortedFilms);
      })
      .catch((err) => console.error("error:" + err));

    console.log(searchInput);

    const urlGenreList = "https://api.themoviedb.org/3/genre/movie/list?language=en";
    fetch(urlGenreList, options)
      .then((res) => res.json())
      .then((json) => {
        setGenreList(json.genres);
      })
      .catch((err) => console.error("error:" + err));

    const urlPeople = `https://api.themoviedb.org/3/search/person?query=${searchInput}&include_adult=false&language=en-US&page=1`;
    fetch(urlPeople, options)
      .then((res) => res.json())
      .then((json) => {
        let sortedPeople = json.results.sort((a, b) => b.popularity - a.popularity);
        console.log(sortedPeople);
        setMatchingPeople(sortedPeople);
      })
      .catch((err) => console.error("error:" + err));
  }, [searchInput]);

  const openFilmPage = (e, movie) => {
    e.preventDefault();
    console.log(movie.title);
    const movieTitle = movie.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(":", "")
      .replace("'", "")
      .replace("·", "-")
      .replace("/", "-");
    navigate(`/film/${movieTitle}`, { state: movie.id });
  };

  const openPersonPage = (e, person) => {
    e.preventDefault();
    console.log(person.id);

    const personURL = person.name.split(" ").join("-").toLowerCase();
    navigate(`/person/${personURL}`, { state: person.id });
  };

  const switchActiveFilter = (e, newFilter) => {
    e.preventDefault();
    setActiveFilter(newFilter);
  };

  return (
    <div className="searchPageWrapper">
      <div className="searchPageRoot">
        <div className="searchPageFilterBox">
          <p className="searchPageSubTitle">Show results for</p>
          <div className="searchPageFilterOptions">
            <p
              className={activeFilter == "Films" ? "searchPageFilterOptionActive" : "searchPageFilterOption"}
              onClick={(e) => switchActiveFilter(e, "Films")}
            >
              Films
            </p>
            <p
              className={activeFilter == "People" ? "searchPageFilterOptionActive" : "searchPageFilterOption"}
              onClick={(e) => switchActiveFilter(e, "People")}
            >
              People
            </p>
          </div>
        </div>
        <div className="searchPageMoviesBox">
          {activeFilter == "Films" && (
            <p className="searchPageSubTitle">{`Found ${matchingFilms.length} films matching "${searchInput}"`}</p>
          )}
          {activeFilter == "People" && (
            <p className="searchPageSubTitle">{`Found ${matchingPeople.length} people matching "${searchInput}"`}</p>
          )}

          {activeFilter == "Films" && matchingFilms.length == 0 && <p>No films matched your search</p>}
          {activeFilter == "People" && matchingPeople.length == 0 && <p>No people matched your search</p>}

          {activeFilter == "Films" && matchingFilms.length != 0 && (
            <div className="searchPageMovies">
              {matchingFilms.map((film) => (
                <div className="searchPageFilm" key={film.id}>
                  {film.poster_path && (
                    <div className="searchPageFilmPosterWrapper" onClick={(e) => openFilmPage(e, film)}>
                      <img
                        className="searchPageFilmPoster"
                        src={`https://image.tmdb.org/t/p/w342${film.poster_path}`}
                      />
                    </div>
                  )}
                  <div className="searchPageFilmInfoBox">
                    <h2 className="searchPageFilmInfoTitle" onClick={(e) => openFilmPage(e, film)}>
                      {film.title}
                    </h2>
                    <p className="searchPageFilmReleaseDate">{film.release_date.split("-")[0]}</p>
                    {film.original_title != film.title && (
                      <p className="searchPageFilmOrigTitle">{`Original title: ${film.original_title}`}</p>
                    )}
                    <div className="searchPageFilmGenreBox">
                      {film.genre_ids.map((genreId) => {
                        const genre = genreList.find((g) => g.id == genreId);
                        return (
                          genre && (
                            <p className="searchPageFilmGenre" key={genreId}>
                              {genre.name}
                            </p>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeFilter == "People" && matchingPeople.length != 0 && (
            <div className="searchPagePeople">
              {matchingPeople.map((p) => (
                <div className="searchPagePerson" key={p.id}>
                  {p.profile_path && (
                    <div className="searchPagePersonImageWrapper" onClick={(e) => openPersonPage(e, p)}>
                      <img className="searchPagePersonImage" src={`https://image.tmdb.org/t/p/w185${p.profile_path}`} />
                    </div>
                  )}
                  <div className="searchPagePersonInfo">
                    <p className="searchPagePersonName" onClick={(e) => openPersonPage(e, p)}>
                      {p.name}
                    </p>
                    <p className="searchPagePersonJob">
                      {p.known_for_department == "Directing"
                        ? "Director"
                        : p.known_for_department == "Acting"
                        ? "Actor"
                        : p.known_for_department == "Writing"
                        ? "Writer"
                        : p.known_for_department}
                    </p>
                    {p.known_for.length != 0 && (
                      <div className="searchPagePersonKnownFor">
                        <p className="searchPagePersonKnownForText">Known for</p>
                        {p.known_for.map((m) => (
                          <p
                            className="searchPagePersonKnownForFilm"
                            key={m.id}
                            onClick={m.title ? (e) => openFilmPage(e, m) : undefined}
                          >
                            {m.title ? m.title : m.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;

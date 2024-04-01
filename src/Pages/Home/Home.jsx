import "./Home.css";
import InFocus from "./InFocus";

import stills from "../../assets/stills.json";
import movies from "../../assets/movies.json";

import { useState } from "react";
import { useEffect } from "react";
import MovieCard from "../../Components/MovieCard/MovieCard";

function Home() {
  const [backdrop, setBackdrop] = useState("");
  const [inFocusPoster, setInFocusPoster] = useState("");
  const [popularMovies, setPopularMovies] = useState([]);
  const [inTheaters, setInTheaters] = useState([]);
  const [bestMovies, setBestMovies] = useState([]);

  useEffect(() => {
    let inFocusMovie = movies.filter((mov) => {
      return mov.title == "My Neighbor Totoro";
    })[0];

    setInFocusPoster(inFocusMovie.thumbnail);
    setBackdrop(stills[0].images[1]);

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWVhYzg5OTM4OGZmMTQxYzU5N2U0MWFiNTBkYjMzYSIsInN1YiI6IjY2MDAwYTJmNDU5YWQ2MDE2NGY4NTFiOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VRSuwwxjrdMmPU0O2hWAkuDgTO1KCMI8YNWj7JAlXxI",
      },
    };

    //get popular movies
    const urlPop = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";

    fetch(urlPop, options)
      .then((res) => res.json())
      .then((json) => {
        let mostPopular = json.results.sort((a, b) => b.popularity - a.popularity).slice(0, 6);
        setPopularMovies(mostPopular);
      })
      .catch((err) => console.error("error:" + err));

    //get movies in theaters

    const urlThe = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";

    fetch(urlThe, options)
      .then((res) => res.json())
      .then((json) => {
        let inTheaters = json.results.sort((a, b) => b.popularity - a.popularity).slice(0, 6);
        setInTheaters(inTheaters);
      })
      .catch((err) => console.error("error:" + err));

    //get best movies
    const urlBest =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=5000&with_original_language=en";

    fetch(urlBest, options)
      .then((res) => res.json())
      .then((json) => {
        setBestMovies(json.results.slice(0, 6));
      })
      .catch((err) => console.error("error:" + err));
  }, []);

  return (
    <div className="homePageWrapper">
      <div className="homePageRoot">
        <InFocus backdrop={backdrop} inFocusPoster={inFocusPoster} />

        <div className="homePagePopular">
          <h2 className="homePagePopularTitle">Popular right now</h2>
          <div className="homePagePopularMovieRow">
            {popularMovies &&
              popularMovies.map((movie) => {
                return <MovieCard movie={movie} key={movie.id} />;
              })}
          </div>
        </div>

        <div className="homePagePopular">
          <h2 className="homePagePopularTitle">In theaters</h2>
          <div className="homePagePopularMovieRow">
            {inTheaters &&
              inTheaters.map((movie) => {
                return <MovieCard movie={movie} key={movie.id} />;
              })}
          </div>
        </div>

        <div className="homePagePopular">
          <h2 className="homePagePopularTitle">Top rated of all time</h2>
          <div className="homePagePopularMovieRow">
            {bestMovies &&
              bestMovies.map((movie) => {
                return <MovieCard movie={movie} key={movie.id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

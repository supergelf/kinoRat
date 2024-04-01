import { useNavigate } from "react-router-dom";
import "./MovieCardPersonPage.css";

function MovieCardPersonPage({ movie }) {
  const navigate = useNavigate();

  const openFilmPage = () => {
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

  return (
    <div className="movieCardPersonPageRoot" onClick={openFilmPage}>
      <div className="movieCardPersonPageOverlay">
        <p className="movieCardPersonPageOverlayTitle">{movie.title}</p>
      </div>
      {movie?.poster_path && (
        <img className="movieCardPersonPageImage" src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} />
      )}
    </div>
  );
}

export default MovieCardPersonPage;

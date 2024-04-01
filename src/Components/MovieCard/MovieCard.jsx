import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
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
    <div className="movieCardRoot" onClick={openFilmPage}>
      <img className="movieCardImage" src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} />
    </div>
  );
}

export default MovieCard;

import { IMG_URL } from "./constants";
export var MovieCard = ({ poster_path, title, vote_average }) => {
  return (
    <div className="movieCard">
      <div>
        <img src={IMG_URL + poster_path} />
      </div>
      <div id="title">{title}</div>
      <h3 className="rating">Rating-{vote_average.toFixed(2)}&#9734;</h3>
    </div>
  );
};
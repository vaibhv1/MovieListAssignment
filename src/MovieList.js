import { useState,useRef,useEffect } from "react";
import axios from 'axios';
import { MovieCard } from "./MovieCard";


const MovieList = () => {
  const [moviesByYear, setMoviesByYear] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({});
  const [years, setYears] = useState([]);
  const lastMovieRef = useRef();

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const year = entries[0].target.getAttribute("data-year");
          setPage((prevPage) => ({
            ...prevPage,
            [year]: (prevPage[year] || 1) + 1,
          }));
        }
      },
      { threshold: 0.5 }
    );

    const lastMovieElements = document.querySelectorAll(".movie:last-child");
    lastMovieElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      lastMovieElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [loading]);

  useEffect(() => {
    if (years.length === 0) return;

    const fetchDataForYear = async (year) => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: "2dca580c2a14b55200e784d157207b4d",
              sort_by: "popularity.desc",
              "vote_count.gte": 100,
              "page-size": 20,
              page: page[year],
              "primary_release_date.gte": `${year}-01-01`,
              "primary_release_date.lte": `${year}-12-31`,
            },
          }
        );

        const newMovies = response.data.results.filter(
          (movie) =>
            !moviesByYear[year] ||
            !moviesByYear[year].some((prevMovie) => prevMovie.id === movie.id)
        );

        const updatedMoviesForYear = moviesByYear[year]
          ? [...moviesByYear[year], ...newMovies]
          : newMovies;
        setMoviesByYear((prevMoviesByYear) => ({
          ...prevMoviesByYear,
          [year]: updatedMoviesForYear.slice(0, 20),
        }));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    years.forEach((year) => {
      if (
        !moviesByYear[year] ||
        (moviesByYear[year] && moviesByYear[year].length < 20)
      ) {
        fetchDataForYear(year);
      }
    });
  }, [years, moviesByYear, page]);

  const fetchYears = async () => {
    try {
      const years = Array.from({ length: 13 }, (_, index) => 2012 + index);
      setYears(years);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  return (
    <div className="movie-list-container">
      {years.map((year) => (
        <div key={year}>
          <h2 className="movies-released">Movies Released in {year}</h2>
          <div className="Body">
            {moviesByYear[year] &&
              moviesByYear[year].map((movie, index) => (
                <MovieCard key={movie.id} {...movie} /> // Use MovieCard component and provide movie props
              ))}
          </div>
          {loading && <p>Loading...</p>}
        </div>
      ))}
    </div>
  );
};

export default MovieList;
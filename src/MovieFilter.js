import { useState,useRef,useEffect } from "react";
import axios from 'axios';
import { MovieCard } from "./MovieCard";
const MovieFilter = ({ onFilterActive }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [maxMoviesToShow, setMaxMoviesToShow] = useState(10); // Maximum number of movies to display
    const genreListRef = useRef(null);

    useEffect(() => {
      // Fetch genres from the API
      axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          api_key: '2dca580c2a14b55200e784d157207b4d',
        }
      })
      .then(response => {
        setGenres(response.data.genres);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
      });
    }, []);

    useEffect(() => {
      if (selectedGenres.length > 0) {
        fetchMoviesByGenres();
      } else {
        setMovies([]); // Clear movies when no genres are selected
        onFilterActive(false); // Notify parent component that filter is not active
      }
    }, [selectedGenres, onFilterActive]);


  const fetchMoviesByGenres = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '2dca580c2a14b55200e784d157207b4d',
          'primary_release_date.gte': '2012-01-01', // Adjusted release date range
          'primary_release_date.lte': '2024-12-31',
          sort_by: 'vote_average.desc', // Sort by vote average in descending order
          page: 1,
          'vote_count.gte': 100,
          with_genres: selectedGenres.join(',')
        }
      });

      // Log API response to check data
      console.log('API response:', response.data.results);

      setMovies(response.data.results);
      onFilterActive(true); // Notify parent component that filter is active
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

    const handleGenreChange = (genreId) => {
      const index = selectedGenres.indexOf(genreId);
      let updatedGenres = [...selectedGenres];

      if (index === -1) {
        updatedGenres.push(genreId);
      } else {
        updatedGenres.splice(index, 1);
      }

      setSelectedGenres(updatedGenres);
    };

    const scrollLeft = () => {
      if (genreListRef.current) {
        genreListRef.current.scrollLeft -= 100; // Adjust scroll distance as needed
      }
    };

    const scrollRight = () => {
      if (genreListRef.current) {
        genreListRef.current.scrollLeft += 100; // Adjust scroll distance as needed
      }
    };

    return (
      <div>
        <h2>Movie Filter</h2>
        <div style={{ position: 'relative', overflow: 'hidden', margin: '0 auto' }}>
          <button className="genre-button" onClick={scrollLeft} style={{ opacity:'0.9', position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)'}}>{"<"}</button>
          <div ref={genreListRef} style={{marginRight:'3%',marginLeft:'3%', display: 'flex', whiteSpace: 'nowrap', overflowX: 'hidden' }}>
            {genres.map(genre => (
              <button
                key={genre.id}
                style={{
                  margin: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: selectedGenres.includes(genre.id) ? '#007bff' : '#e0e0e0',
                  color: selectedGenres.includes(genre.id) ? '#ffffff' : '#000000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleGenreChange(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
          <button onClick={scrollRight} style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>{">"}</button>
        </div>
        <div>
          <div className="Body">
            {movies.map(movie => (
              <MovieCard key={movie.id} {...movie}></MovieCard>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MovieFilter;
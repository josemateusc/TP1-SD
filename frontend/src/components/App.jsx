import React, { useState, useEffect } from "react";
import MovieForm from "./MovieForm";
import MovieList from "./MovieList";
import api from "../services/api";
import "./App.css";

function App() {
  const [moviesDb1, setMoviesDb1] = useState([]);
  const [moviesDb2, setMoviesDb2] = useState([]);
  const [moviesCommon, setMoviesCommon] = useState([]);
  const [error, setError] = useState();

  const fetchMovies = async (endpoint, setter) => {
    try {
      const { data } = await api.get(endpoint);
      setter(data);
    } catch (error) {
      setError(`Could not fetch the movies from ${endpoint}`);
    }
  };

  const handleAddMovie = async (title, endpoint, setter) => {
    try {
      const movie = { _id: Date.now(), title };

      const { data: savedMovie } = await api.create(endpoint, movie);
      // setter((prevMovies) => [...prevMovies, savedMovie]);
      fetchMovies(endpoint, setter)
      fetchMovies("/compare", setMoviesCommon);
    } catch (error) {
      setError(`Could not save the movie to ${endpoint}`);
    }
  };

  const handleDeleteMovie = async (movie, endpoint, setter) => {
    try {
      setter((prevMovies) => prevMovies.filter((m) => m !== movie));
      await api.remove(endpoint + "/" + movie._id);
      fetchMovies("/compare", setMoviesCommon);
    } catch (error) {
      setError(`Could not delete the movie from ${endpoint}`);
      setter((prevMovies) => prevMovies);
    }
  };
  
  const deleteBoth = () => {
    window.alert("Por favor, delete o filme individualmente em cada BD!");
  };

  useEffect(() => {
    fetchMovies("/db1/movies", setMoviesDb1);
    fetchMovies("/db2/movies", setMoviesDb2);
    fetchMovies("/compare", setMoviesCommon);
  }, []);

  return (
    <div className="Major">
      <div className="App">
        <h1>Banco de Dados 1:</h1>
        <MovieForm onAddMovie={(title) => handleAddMovie(title, "/db1/movies", setMoviesDb1)} />
        {error && (
          <p role="alert" className="Error">
            {error}
          </p>
        )}
        <MovieList movies={moviesDb1} onDeleteMovie={(movie) => handleDeleteMovie(movie, "/db1/movies", setMoviesDb1)} />
      </div>
      <div className="App">
        <h1>Banco de Dados 2:</h1>
        <MovieForm onAddMovie={(title) => handleAddMovie(title, "/db2/movies", setMoviesDb2)} />
        {error && (
          <p role="alert" className="Error">
            {error}
          </p>
        )}
        <MovieList movies={moviesDb2} onDeleteMovie={(movie) => handleDeleteMovie(movie, "/db2/movies", setMoviesDb2)} />
      </div>
      <div className="App">
        <h1>O que tem em ambos os bancos:</h1>
        <MovieList movies={moviesCommon} onDeleteMovie={deleteBoth}/>
      </div>
    </div>
  );
}

export default App;

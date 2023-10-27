const express = require("express");
const validateId = require("../middleware/validateId");
const movieSchema = require("../models/movie");
const mongoose = require("mongoose");
const db = require("../db");

const router = express.Router();

const getDbConnection = (dbName) => {
  if (dbName === "db1") {
    return mongoose.createConnection(db.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } else if (dbName === "db2") {
    return mongoose.createConnection(db.db2Url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } else {
    throw new Error("Invalid database name");
  }
};

router.get("/:db/movies", async (req, res) => {
  try {
    const connection = getDbConnection(req.params.db);
    const Movie = connection.model("Movie", movieSchema);
    const movies = await Movie.find().sort("title");
    res.send(movies);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch movies." });
  }
});

router.get("/:db/movies/:id", validateId, async (req, res) => {
  try {
    const connection = getDbConnection(req.params.db);
    const Movie = connection.model("Movie", movieSchema);
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send();
    res.send(movie);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch the movie." });
  }
});

router.post("/:db/movies", async (req, res) => {
  try {
    if (!req.body.title) return res.status(400).send("Title is required.");
    const connection = getDbConnection(req.params.db);
    const Movie = connection.model("Movie", movieSchema);
    const movie = new Movie({ title: req.body.title });
    await movie.save();
    res.status(201).send(movie);
  } catch (err) {
    res.status(500).send({ error: "Failed to save the movie." });
  }
});

router.delete("/:db/movies/:id", async (req, res) => {
  try {
    const connection = getDbConnection(req.params.db);
    const Movie = connection.model("Movie", movieSchema);
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ error: "Failed to delete the movie." });
  }
});

router.get("/compare", async (req, res) => {
  try {
    const connectionDb1 = getDbConnection("db1");
    const MovieDb1 = connectionDb1.model("Movie", movieSchema);
    const moviesInDb1 = await MovieDb1.find();

    const connectionDb2 = getDbConnection("db2");
    const MovieDb2 = connectionDb2.model("Movie", movieSchema);

    const moviesInBothDbs = [];
    for (let movie of moviesInDb1) {
      const movieInDb2 = await MovieDb2.findOne({ title: movie.title });
      if (movieInDb2) {
        moviesInBothDbs.push(movie);
      }
    }

    res.send(moviesInBothDbs.sort((a, b) => a.title.localeCompare(b.title)));
  } catch (err) {
    res.status(500).send({ error: "Failed to compare movies." });
  }
});

module.exports = router;

import Movie from "../models/Movie.js";
import path from "path";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const normalizeGenres = (genre) => {
  if (Array.isArray(genre)) {
    return genre.filter(Boolean);
  }

  if (genre) {
    return [genre];
  }

  return [];
};

const createMovie = async (req, res) => {
  try {
    // console.log(process.cwd());
    // console.log("Request body:", req.body);
    const uploadedImage = (await uploadOnCloudinary(req.body.image))?.url; 

    const moviePayload = {
      ...req.body,
      image: uploadedImage,
      genre: normalizeGenres(req.body.genre),
    };

    const newMovie = new Movie(moviePayload);
    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const specificMovie = await Movie.findById(id);
    if (!specificMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(specificMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        ...req.body,
        genre: normalizeGenres(req.body.genre),
      },
      {
        new: true,
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const movieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Movie already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      await movie.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMovie = await Movie.findByIdAndDelete(id);

    if (!deleteMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length
        : 0;

    await movie.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getNewMovies = async (req, res) => {
  try {
    const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10);
    res.json(newMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMovies = async (req, res) => {
  try {
    const topRatedMovies = await Movie.find()
      .sort({ numReviews: -1 })
      .limit(10);
    res.json(topRatedMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const randomMovies = await Movie.aggregate([{ $sample: { size: 10 } }]);
    res.json(randomMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonalizedMovies = async (req, res) => {
  try {
    const genreRatings = await Movie.aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews.user": req.user._id } },
      { $unwind: "$genre" },
      {
        $group: {
          _id: "$genre",
          averageRating: { $avg: "$reviews.rating" },
          ratingCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, ratingCount: -1 } },
    ]);

    if (genreRatings.length === 0) {
      const fallbackMovies = await Movie.aggregate([{ $sample: { size: 10 } }]);
      return res.json(fallbackMovies);
    }

    const reviewedMovieIds = await Movie.find({
      "reviews.user": req.user._id,
    }).distinct("_id");
    const rankedGenreIds = genreRatings.map((genre) => genre._id);
    const genreRank = new Map(
      rankedGenreIds.map((genreId, index) => [genreId.toString(), index])
    );

    let personalizedMovies = await Movie.find({
      _id: { $nin: reviewedMovieIds },
      genre: { $in: rankedGenreIds },
    })
      .populate("genre")
      .lean();

    personalizedMovies.sort((firstMovie, secondMovie) => {
      const getBestGenreRank = (movie) =>
        Math.min(
          ...movie.genre.map(
            (genre) => genreRank.get(genre._id.toString()) ?? Infinity
          )
        );

      const rankDifference =
        getBestGenreRank(firstMovie) - getBestGenreRank(secondMovie);

      if (rankDifference !== 0) {
        return rankDifference;
      }

      return new Date(secondMovie.createdAt) - new Date(firstMovie.createdAt);
    });

    if (personalizedMovies.length === 0) {
      personalizedMovies = await Movie.find({
        _id: { $nin: reviewedMovieIds },
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("genre")
        .lean();
    } else {
      personalizedMovies = personalizedMovies.slice(0, 10);
    }

    res.json(personalizedMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
  getPersonalizedMovies,
};

import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const visibleGenres = genres?.slice(0, 8) || [];

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  const filteredMovies = data?.filter(
    (movie) =>
      selectedGenre === null ||
      (Array.isArray(movie.genre)
        ? movie.genre.includes(selectedGenre)
        : movie.genre === selectedGenre)
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6 xl:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm lg:p-4">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Genres
          </p>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 lg:flex-wrap lg:items-center lg:justify-center xl:justify-start">
            <button
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedGenre === null
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => handleGenreClick(null)}
            >
              All
            </button>

            {visibleGenres.map((g) => (
              <button
                key={g._id}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedGenre === g._id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => handleGenreClick(g._id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="flex w-full flex-col items-center gap-8">
        <div className="w-full max-w-[100rem]">
          <h1 className="mb-5 inline-flex items-center rounded-full border border-sky-400/60 bg-sky-100 px-4 py-2 text-xl font-bold text-slate-900 shadow-sm shadow-sky-900/20">
            Choose For You
          </h1>
          <SliderUtil data={randomMovies} />
        </div>

        <div className="w-full max-w-[100rem]">
          <h1 className="mb-5 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-100 px-4 py-2 text-xl font-bold text-slate-900 shadow-sm shadow-amber-900/20">
            Top Movies
          </h1>
          <SliderUtil data={topMovies} />
        </div>

        <div className="w-full max-w-[100rem]">
          <h1 className="mb-5 inline-flex items-center rounded-full border border-emerald-400/70 bg-emerald-100 px-4 py-2 text-xl font-bold text-slate-900 shadow-sm shadow-emerald-900/20">
            Choose Movie
          </h1>
          <SliderUtil data={filteredMovies} />
        </div>
      </section>
    </div>
  );
};

export default MoviesContainerPage;

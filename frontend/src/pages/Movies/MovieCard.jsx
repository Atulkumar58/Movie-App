import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div key={movie._id} className="group m-[2rem] w-[20rem] overflow-hidden rounded-xl border border-gray-700 bg-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <Link to={`/movies/${movie._id}`} className="block">
        <img
          src={movie.image}
          alt={movie.name}
          className="h-[20rem] w-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
        />
      </Link>

      <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-4 py-3">
        <p className="text-base font-semibold text-white opacity-100">
          {movie.name}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;

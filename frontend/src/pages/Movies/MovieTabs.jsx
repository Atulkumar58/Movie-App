import { Link } from "react-router-dom";

const MovieTabs = ({ userInfo, submitHandler, comment, setComment, movie, rating, setRating }) => {
  const renderStars = (currentRating, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "div"}
            onClick={interactive ? () => setRating(star) : undefined}
            className={`text-3xl ${
              star <= currentRating ? "text-yellow-400" : "text-gray-400"
            } ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <section>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            <div className="my-4">
              <label className="block text-xl mb-3">
                Rating
              </label>
              {renderStars(rating, true)}
              {rating > 0 && (
                <p className="text-yellow-400 font-semibold mt-2">
                  {rating} / 5
                </p>
              )}
            </div>

            <div className="my-2">
              <label htmlFor="comment" className="block text-xl mb-2">
                Write Your Review
              </label>

              <textarea
                id="comment"
                rows="3"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border rounded-lg xl:w-[40rem] text-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          <p>
            Please <Link to="/login">Sign In</Link> to write a review
          </p>
        )}
      </section>

      <section className="mt-[3rem]">
        <div>{movie?.reviews.length === 0 && <p>No Reviews</p>}</div>

        <div>
          {movie?.reviews.map((review) => (
            <div
              key={review._id}
              className="bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]"
            >
              <div className="flex justify-between">
                <strong className="text-[#B0B0B0]">{review.name}</strong>
                <p className="text-[#B0B0B0]">
                  {review.createdAt.substring(0, 10)}
                </p>
              </div>

              <div className="mt-2">
                {renderStars(review.rating, false)}
              </div>

              <p className="my-4">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieTabs;

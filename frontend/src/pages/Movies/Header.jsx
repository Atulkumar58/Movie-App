import SliderUtil from "../../component/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useGetNewMoviesQuery();

  return (
    <div className="mt-[2rem] px-4 md:px-6">
      <div className="w-full">
        <SliderUtil data={data} />
      </div>
    </div>
  );
};

export default Header;

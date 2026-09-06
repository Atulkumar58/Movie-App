import Header from "./Movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";
import Footer from "../component/Footer";

const Home = () => {
  return (
    <>
      <Header />

      <section className="mt-[10rem]">
        <MoviesContainerPage />
      </section>

      <Footer />
    </>
  );
};

export default Home;

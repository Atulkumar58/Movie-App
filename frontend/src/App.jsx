import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";

const App = () => {
  return (
    <>
      <ToastContainer />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-amber-300/40 bg-slate-950/85 backdrop-blur-sm">
        <div className="flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="border border-amber-300/80 bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4 py-2 shadow-[0_0_20px_rgba(251,191,36,0.35)] sm:px-5">
            <span className="block whitespace-nowrap text-base font-black uppercase tracking-[0.18em] text-white sm:text-lg">
              Movie Review System
            </span>
          </div>

          <div className="flex items-center justify-end">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="pt-[90px]">
        <Outlet />
      </main>
    </>
  );
};

export default App;

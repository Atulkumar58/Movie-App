import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const GITHUB_USERNAME = "Atulkumar58";
const LINKEDIN_URL = "https://www.linkedin.com/in/atul-kumar-161032302/";

const Footer = () => {
  const [developer, setDeveloper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDeveloper = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch GitHub profile");
        }

        const profile = await response.json();
        setDeveloper(profile);
      } catch (error) {
        if (error.name !== "AbortError") {
          setDeveloper({
            name: GITHUB_USERNAME,
            avatar_url: "https://github.com/identicons/Atulkumar58.png",
            html_url: `https://github.com/${GITHUB_USERNAME}`,
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDeveloper();

    return () => controller.abort();
  }, []);

  return (
    <footer className="mt-10 border-t border-slate-700/70 bg-slate-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[100rem]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          Built by
        </p>

        {isLoading ? (
          <div className="h-32 animate-pulse rounded-2xl border border-slate-700 bg-slate-900" />
        ) : (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 sm:flex-row">
            <img
              src={developer.avatar_url}
              alt={`${developer.name || developer.login} profile`}
              className="h-20 w-20 rounded-full border-2 border-amber-300 object-cover"
            />

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">
                {developer.name || developer.login}
              </h2>
              {developer.bio && (
                <p className="mt-1 text-sm text-slate-400">{developer.bio}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <a
                href={developer.html_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Developer GitHub profile"
                title="GitHub"
                className="rounded-full border border-slate-600 p-3 text-slate-200 transition hover:border-amber-300 hover:text-amber-300"
              >
                <FaGithub size={20} />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Developer LinkedIn profile"
                title="LinkedIn"
                className="rounded-full border border-slate-600 p-3 text-slate-200 transition hover:border-sky-400 hover:text-sky-400"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Movie Review System
        </p>
      </div>
    </footer>
  );
};

export default Footer;
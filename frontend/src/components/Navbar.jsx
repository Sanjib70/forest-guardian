import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // ✅ NEW

  // 🔁 Re-check user on route change
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-green-900 text-white px-6 py-3">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🌲</span>
          <span className="text-lg font-bold tracking-wide">
            Forest Guardian
          </span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm md:text-base">
          <Link to="/map" className="hover:text-green-300">
            Interactive Map
          </Link>
          <Link to="/forest-data" className="hover:text-green-300">
            Forest Data
          </Link>
          <Link to="/report-issue" className="hover:text-green-300">
            Report Issue
          </Link>
          <Link to="/health-index" className="hover:text-green-300">
            Health Index
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span>
                Welcome,{" "}
                <span className="font-semibold text-green-200">
                  {user.name}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>

        {/* 🔥 HAMBURGER BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 🔥 MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm">

          <Link to="/map" onClick={() => setIsOpen(false)}>
            Interactive Map
          </Link>

          <Link to="/forest-data" onClick={() => setIsOpen(false)}>
            Forest Data
          </Link>

          <Link to="/report-issue" onClick={() => setIsOpen(false)}>
            Report Issue
          </Link>

          <Link to="/health-index" onClick={() => setIsOpen(false)}>
            Health Index
          </Link>

          <hr className="border-green-700" />

          {user ? (
            <>
              <span>
                Welcome,{" "}
                <span className="font-semibold text-green-200">
                  {user.name}
                </span>
              </span>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-600 px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 px-4 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
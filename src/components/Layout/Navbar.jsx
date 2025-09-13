import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import DarkModeToggle from "../DarkModeToggle";
import NotificationBell from "../Notification/NotificationBell";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";
import logo from "../../assets/petut.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalQuantity } = useSelector((state) => state.cart);
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const totalUnreadMessages = useUnreadMessages();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const fetchUserData = async () => {
    if (currentUser) {
      const db = getFirestore();
      // Create a reference to the user's document in the 'users' collection
      const userDocRef = doc(db, "users", currentUser.uid);

      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // If the document exists, set the user data in state
          setUserData(docSnap.data());
        } else {
          console.log("No such document in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [currentUser]);
  return (
    <>
      <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img
                src={logo}
                width={60}
                height={60}
                alt="Petut Logo"
                className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app font-medium transition-colors duration-200 group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary_app transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/catalog"
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app font-medium transition-colors duration-200 group"
              >
                Catalog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary_app transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {currentUser && (
                <Link
                  to="/favorites"
                  className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app font-medium transition-colors duration-200 group"
                >
                  Favorites
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary_app transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
              <Link
                to="/clinics"
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app font-medium transition-colors duration-200 group"
              >
                Health
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary_app transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/community"
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app font-medium transition-colors duration-200 group"
              >
                Community
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary_app transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/contact-us"
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app font-medium transition-colors duration-200 group"
              >
                Support
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary_app transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => navigate("/cart")}
                className="relative p-3 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary_app text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {/* Messages Icon */}
              {currentUser && (
                <button
                  onClick={() => navigate("/chats")}
                  className="relative p-3 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="Messages"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {totalUnreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                    </span>
                  )}
                </button>
              )}

              {/* Notification Bell */}
              <NotificationBell />

              <DarkModeToggle />

              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="p-3 text-gray-700 dark:text-gray-300 hover:text-primary_app dark:hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary_app hover:bg-primary_app/10 rounded-lg transition-all duration-200 font-medium border border-primary_app text-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-primary_app/90 transition-all duration-200 font-medium text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary_app text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </button>

              <NotificationBell />
              <DarkModeToggle />

              <button
                onClick={toggleMenu}
                type="button"
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/catalog"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
              >
                Catalog
              </Link>
              {currentUser && (
                <Link
                  to="/favorites"
                  onClick={toggleMenu}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
                >
                  Favorites
                </Link>
              )}
              <Link
                to="/clinics"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
              >
                Health
              </Link>
              <Link
                to="/community"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
              >
                Community
              </Link>
              <Link
                to="/contact-us"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
              >
                Support
              </Link>

              {currentUser && (
                <Link
                  to="/chats"
                  onClick={toggleMenu}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
                >
                  Messages
                </Link>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={toggleMenu}
                      className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary_app font-medium transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="block px-6 py-3 text-center bg-primary_app text-white rounded-full font-semibold hover:bg-primary_app/90 transition-all duration-200 shadow-lg"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={toggleMenu}
                      className="block px-6 py-3 text-center border-2 border-primary_app text-primary_app rounded-full font-semibold hover:bg-primary_app/10 transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

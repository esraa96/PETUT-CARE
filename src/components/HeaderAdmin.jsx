import { onAuthStateChanged } from 'firebase/auth';
import { Fragment, useEffect, useState } from 'react'
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import { auth, db } from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import DarkModeToggle from './DarkModeToggle';

export default function HeaderAdmin({ toggleSidebar }) {
  const [adminData, setAdminData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get admin data from firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminRef = doc(db, 'users', user.uid);
        const adminSnap = await getDoc(adminRef);

        const data = adminSnap.data();
        if (data?.role === 'admin') {
          setAdminData(data);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Fragment>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors"
            >
              <FaBars size={20} />
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {adminData?.fullName || 'Admin'}
              </p>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petut-brown-300 focus:border-transparent transition-colors"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaBell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {adminData?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <div className="relative">
                <img
                  src={adminData?.profileImage || 'https://via.placeholder.com/40x40?text=A'}
                  alt="Admin Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </Fragment>
  )
}

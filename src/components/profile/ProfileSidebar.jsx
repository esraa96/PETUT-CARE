import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../firebase";
import {
  HiOutlineUserCircle,
  HiOutlineShoppingCart,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineCube,
  HiOutlineHeart,
  HiOutlineCalendar
} from "react-icons/hi";
import { FaCat } from "react-icons/fa6";

const ProfileSidebar = ({
  currentUser,
  activeTab,
  setActiveTab,
  handleLogout,
}) => {
  const navItems = [
    { id: "profile", label: "Profile", icon: <HiOutlineUserCircle className="h-5 w-5 mr-3" /> },
    { id: "orders", label: "Orders", icon: <HiOutlineShoppingCart className="h-5 w-5 mr-3" /> },
    { id: "pets", label: "My Pets", icon: <FaCat className="h-5 w-5 mr-3" /> },
    { id: "reservations", label: "Reservations", icon: <HiOutlineCalendar className="h-5 w-5 mr-3" /> },
    { id: "favorites", label: "Favorites", icon: <HiOutlineHeart className="h-5 w-5 mr-3" /> },
    { id: "settings", label: "Settings", icon: <HiOutlineCog className="h-5 w-5 mr-3" /> },
  ];

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchProfileImage() {
      if (currentUser?.uid) {
        const profile = await getUserProfile(currentUser.uid);
        if (profile && profile.profileImage) {
          setProfileImage(profile.profileImage);
        } else {
          setProfileImage(null);
        }
      }
    }
    fetchProfileImage();
  }, [currentUser?.uid]);

  return (
    <div className="md:w-1/4">
      <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-300">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
            <img
              src={
                profileImage ||
                currentUser?.photoURL ||
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt={currentUser?.displayName || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl dark:text-white font-bold">
            {currentUser?.displayName || "User"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {currentUser?.email || "user@example.com"}
          </p>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-primary_app text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500 dark:text-white transition-colors"
            >
              <HiOutlineLogout className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
export default ProfileSidebar;

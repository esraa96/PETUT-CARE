import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function AdminAvatar({
  size = "md",
  showStatus = true,
  className = "",
}) {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminRef = doc(db, "users", user.uid);
          const adminSnap = await getDoc(adminRef);
          const data = adminSnap.data();

          if (data?.role === "admin") {
            setAdminData(data);
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "md":
        return "w-10 h-10";
      case "lg":
        return "w-16 h-16";
      case "xl":
        return "w-24 h-24";
      case "2xl":
        return "w-32 h-32";
      default:
        return "w-10 h-10";
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case "sm":
        return "w-2 h-2";
      case "md":
        return "w-3 h-3";
      case "lg":
        return "w-4 h-4";
      case "xl":
        return "w-5 h-5";
      case "2xl":
        return "w-6 h-6";
      default:
        return "w-3 h-3";
    }
  };

  const generateAvatarUrl = () => {
    const name = adminData?.fullName || "Admin";
    const encodedName = encodeURIComponent(name);
    const sizeParam =
      size === "sm"
        ? "32"
        : size === "md"
        ? "40"
        : size === "lg"
        ? "64"
        : size === "xl"
        ? "96"
        : "128";

    return `https://ui-avatars.com/api/?name=${encodedName}&background=C19635&color=fff&size=${sizeParam}&font-size=0.33`;
  };

  if (loading) {
    return (
      <div
        className={`${getSizeClasses()} ${className} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`}
      ></div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={
          adminData?.profileImage || adminData?.photoURL || generateAvatarUrl()
        }
        alt="Admin Profile"
        className={`${getSizeClasses()} rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover`}
        onError={(e) => {
          e.target.src = generateAvatarUrl();
        }}
      />
      {showStatus && (
        <div
          className={`absolute bottom-0 right-0 ${getStatusSize()} bg-green-500 border-2 border-white dark:border-gray-800 rounded-full`}
        ></div>
      )}
    </div>
  );
}

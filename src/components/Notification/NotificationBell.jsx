import React, { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const NotificationBell = () => {
  const { currentUser } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const userNotifications = userData.notifications || [];
        const unreadCount = userNotifications.filter((n) => !n.read).length;
        setNotificationCount(unreadCount);
        setNotifications(userNotifications.slice(0, 5));
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === "granted") {
        if (currentUser) {
          await updateDoc(doc(db, "users", currentUser.uid), {
            notificationPermission: "granted",
          });
        }
      }
    }
  };

  const markAsRead = async (notificationId) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedNotifications =
        userData.notifications?.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ) || [];

      await updateDoc(userRef, {
        notifications: updatedNotifications,
      });
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedNotifications =
        userData.notifications?.map((n) => ({ ...n, read: true })) || [];

      await updateDoc(userRef, {
        notifications: updatedNotifications,
      });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <FiBell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#313340] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold dark:text-white">
                Notifications
              </h3>
              {notificationCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary_app hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {permission === "default" && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Allow us to send notifications
                </p>
                <button
                  onClick={requestPermission}
                  className="px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-primary_app/90 transition-colors"
                >
                  Enable Notifications
                </button>
              </div>
            )}

            {permission === "denied" && (
              <div className="p-4 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Notifications are denied. Please enable them in browser
                  settings.
                </p>
              </div>
            )}

            {permission === "granted" && notifications.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No new notifications
                </p>
              </div>
            )}

            {permission === "granted" && notifications.length > 0 && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {notification.timestamp
                            ? new Date(notification.timestamp).toLocaleString(
                                "en-GB"
                              )
                            : ""}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;

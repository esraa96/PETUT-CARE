import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../store/slices/orderSlice";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileForm from "../components/profile/ProfileForm";
import OrdersTab from "../components/profile/OrdersTab";
import PetsTab from "../components/profile/PetsTab.jsx";
import FavoritesTab from "../components/profile/FavoritesTab";
import SettingsTab from "../components/profile/SettingsTab";
import ReservationsTab from "../components/profile/ReservationsTab";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserOrders(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Failed to log out", error);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileForm currentUser={currentUser} />;
      case "orders":
        return <OrdersTab orders={orders} loading={loading} error={error} />;
      case "pets":
        return <PetsTab currentUser={currentUser} />;
      case "reservations":
        return <ReservationsTab />;
      case "favorites":
        return <FavoritesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <ProfileForm currentUser={currentUser} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        <div className="md:w-3/4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;

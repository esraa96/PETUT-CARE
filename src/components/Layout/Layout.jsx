import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingHelpButton from "../FloatingHelpButton/FloatingHelpButton";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingHelpButton />
    </div>
  );
};

export default Layout;

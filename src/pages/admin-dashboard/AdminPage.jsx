import { Fragment, useState } from "react";
import Sidebar from "../../components/admindash/Sidebar";
import ContentAdminDash from "../../components/admindash/ContentAdminDash";
import HeaderAdmin from "../../components/HeaderAdmin";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Fragment>
      <div className="dashboard-container">
        <HeaderAdmin toggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-hidden lg:ml-64">
            <ContentAdminDash />
          </main>
        </div>
      </div>
    </Fragment>
  );
}

import { Fragment, useState } from 'react'
import Sidebar from '../../components/admindash/Sidebar'
import ContentAdminDash from '../../components/admindash/ContentAdminDash'
import HeaderAdmin from '../../components/HeaderAdmin'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderAdmin toggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 lg:ml-64 transition-all duration-300">
            <div className="p-4 lg:p-6">
              <ContentAdminDash />
            </div>
          </main>
        </div>
      </div>
    </Fragment>
  )
}

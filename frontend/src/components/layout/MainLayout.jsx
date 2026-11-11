import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-950">

      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 text-white">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainLayout
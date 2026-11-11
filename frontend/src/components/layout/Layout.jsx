
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import CursorGlow from '../motion/CursorGlow'

function Layout() {
  return (
    <div className="relative min-h-screen bg-[#060411] text-white">
      <CursorGlow />

      <div className="relative z-10">
        <Navbar />

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

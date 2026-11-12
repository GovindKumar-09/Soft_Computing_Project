import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../app/useAuth'

function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />
}

export default RequireAuth

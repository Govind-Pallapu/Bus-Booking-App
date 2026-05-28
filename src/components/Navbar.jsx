import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await api.post('/users/logout') } catch (_) { }
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to={!user ? '/' : user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="navbar-brand">
        🚌 Buddy Bus Booking
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'ADMIN' ? (
              <>
                <Link to="/admin">🏠 Dashboard</Link>
                <Link to="/admin/buses">🚌 Buses</Link>
                <Link to="/admin/users">👥 Users</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">🏠 Home</Link>
                <Link to="/search">🔍 Search</Link>
                <Link to="/my-bookings">🎫 My Bookings</Link>
              </>
            )}
            <span className="nav-user navbar-links">👤 {user.name}</span>
            <button onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

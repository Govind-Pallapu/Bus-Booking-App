import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const cards = [
    { icon:'🔍', title:'Search Bus', desc:'Find available buses and book your seat instantly', path:'/search', bg:'#dbeafe' },
    { icon:'🎫', title:'My Bookings', desc:'View all your confirmed and cancelled tickets', path:'/my-bookings', bg:'#dcfce7' },
  ]

  return (
    <div className="page">
      <div className="welcome">
        <h2>👋 Welcome, {user?.name}!</h2>
        <p>Book your bus tickets easily and travel comfortably across India.</p>
      </div>

      <h2 className="page-title">What would you like to do?</h2>
      <div className="dash-grid">
        {cards.map(c => (
          <div key={c.title} className="dash-card" onClick={() => navigate(c.path)} style={{background:c.bg}}>
            <div className="dash-icon">{c.icon}</div>
            <div className="dash-title">{c.title}</div>
            <div className="dash-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

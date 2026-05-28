import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const cards = [
    { icon:'🚌', title:'Manage Buses',  desc:'Add, update, delete and view all buses', path:'/admin/buses', bg:'#dbeafe' },
    { icon:'👥', title:'View Users',    desc:'See all registered users in the system',  path:'/admin/users', bg:'#dcfce7' },
  ]

  return (
    <div className="page">
      <div className="welcome">
        <h2>🛡️ Admin Panel — Welcome, {user?.name}!</h2>
        <p>Manage the entire bus booking system from here.</p>
      </div>

      <h2 className="page-title">Admin Actions</h2>
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

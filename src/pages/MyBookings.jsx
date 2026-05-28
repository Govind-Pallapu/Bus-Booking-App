import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [msg, setMsg]           = useState('')
  const [cancelling, setCancelling] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await api.get('/bookings/my-bookings')
      setBookings(res.data.data || [])
    } catch { setError('Failed to load bookings.') }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (ticketNumber) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(ticketNumber); setMsg('')
    try {
      await api.post(`/bookings/cancel/${ticketNumber}`)
      setMsg('✅ Booking cancelled successfully!')
      fetchBookings()
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Cancellation failed.'))
    } finally { setCancelling(null) }
  }

  if (loading) return <div className="page"><div className="loading"><div className="spinner"/> Loading your bookings...</div></div>

  return (
    <div className="page">
      <h2 className="page-title">🎫 My Bookings</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {msg   && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      {bookings.length === 0
        ? <div className="empty">
            <div className="empty-icon">🎫</div>
            <div className="empty-text">No bookings yet.</div>
            <p style={{color:'#94a3b8',marginTop:'.5rem',fontSize:'.85rem'}}>Search for a bus and book your first ticket!</p>
          </div>
        : <>
            <p style={{color:'#64748b',marginBottom:'1rem',fontSize:'.875rem'}}>Total {bookings.length} booking(s)</p>
            {bookings.map(t => (
              <div key={t.ticketNumber} className={`ticket-card ${t.status === 'CANCELLED' ? 'cancelled' : ''}`}>
                <div className="ticket-header">
                  <div>
                    <div className="ticket-number">🎫 {t.ticketNumber}</div>
                    <div className="ticket-route">
                      📍 {t.fromPlace} <span style={{color:'#94a3b8'}}>→</span> {t.toPlace}
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'.4rem'}}>
                    <span className={`badge ${t.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>{t.status}</span>
                    <span style={{fontWeight:800,color:'#1e40af',fontSize:'1.1rem'}}>₹{t.fare}</span>
                  </div>
                </div>

                <div className="ticket-grid">
                  {[
                    ['Passenger', t.passengerName],
                    ['Bus Name',  t.busName],
                    ['Bus No',    t.busNumber],
                    ['Seat No',   `💺 ${t.seatNumber}`],
                    ['Journey Date', `📅 ${t.journeyDate}`],
                    ['Departure',    `🕐 ${t.departureTime}`],
                    ['Arrival',      `🕐 ${t.arrivalTime}`],
                    ['Booked At',    t.bookedAt?.substring(0,16).replace('T',' ')],
                  ].map(([label, value]) => (
                    <div key={label} className="t-item">
                      <label>{label}</label>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>

                {t.status === 'CONFIRMED' && (
                  <div style={{marginTop:'1rem'}}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(t.ticketNumber)}
                      disabled={cancelling === t.ticketNumber}
                    >
                      {cancelling === t.ticketNumber ? 'Cancelling...' : '❌ Cancel Booking'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
      }
    </div>
  )
}

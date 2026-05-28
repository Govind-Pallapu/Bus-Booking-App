import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function SearchBus() {
  const { user } = useAuth()

  const [form, setForm] = useState({ from: '', to: '' })
  const [buses, setBuses] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedBus, setSelectedBus] = useState(null)
  const [bookingForm, setBookingForm] = useState({ passengerName: '', journeyDate: '' })
  const [availableSeats, setAvailableSeats] = useState([])
  const [bookedSeats, setBookedSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [seatsLoading, setSeatsLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [ticket, setTicket] = useState(null)

  // Search buses
  const handleSearch = async e => {
    e.preventDefault()
    setLoading(true); setError(''); setBuses([]); setSearched(false)
    try {
      const res = await api.get(`/search/buses?from=${form.from}&to=${form.to}`)
      setBuses(res.data.data || [])
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed.')
    } finally { setLoading(false) }
  }

  // Open booking modal — also fetch available seats
  const openModal = async bus => {
    setSelectedBus(bus)
    setBookingForm({ passengerName: user?.name || '', journeyDate: '' })
    setSelectedSeat(null)
    setBookingError('')
    setTicket(null)
    setSeatsLoading(true)

    try {
      const res = await api.get(`/bookings/available-seats/${bus.id}`)
      const available = res.data.data || []
      setAvailableSeats(available)

      // Calculate booked seats
      const totalCapacity = bus.availableSeats + (bus.id ? 0 : 0)
      const allSeats = Array.from({ length: bus.availableSeats + (40 - available.length) }, (_, i) => i + 1)
      setBookedSeats(allSeats.filter(s => !available.includes(s)))
    } catch {
      setAvailableSeats([])
      setBookedSeats([])
    } finally { setSeatsLoading(false) }
  }

  const closeModal = () => {
    setSelectedBus(null)
    setTicket(null)
    setSelectedSeat(null)
    setAvailableSeats([])
    setBookedSeats([])
  }

  // Book seat
  const handleBook = async e => {
    e.preventDefault()
    if (!selectedSeat) { setBookingError('Please select a seat first!'); return }
    setBookingLoading(true); setBookingError('')
    try {
      const res = await api.post('/bookings/book', {
        busId: selectedBus.id,
        passengerName: bookingForm.passengerName,
        journeyDate: bookingForm.journeyDate,
        seatNumber: selectedSeat,
      })
      setTicket(res.data.data)
      setBuses(buses.map(b => b.id === selectedBus.id ? { ...b, availableSeats: b.availableSeats - 1 } : b))
    } catch (err) {
      const d = err.response?.data
      if (d?.data && typeof d.data === 'object') setBookingError(Object.values(d.data).join(', '))
      else setBookingError(d?.message || 'Booking failed.')
    } finally { setBookingLoading(false) }
  }

  // All seat numbers for this bus
  const totalSeats = availableSeats.length + bookedSeats.length || 40
  const allSeatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1)

  return (
    <div className="page">
      <h2 className="page-title">🔍 Search Buses</h2>

      {/* Search Form */}
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="form-group">
          <label>From City</label>
          <input placeholder="e.g. Hyderabad" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>To City</label>
          <input placeholder="e.g. Chennai" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading"><div className="spinner" /> Searching...</div>}

      {/* Bus Results */}
      {searched && !loading && (
        buses.length === 0
          ? <div className="empty"><div className="empty-icon">🚫</div><div className="empty-text">No buses found.</div></div>
          : <>
            <div className="alert alert-info">✅ {buses.length} bus(es) found for <strong>{form.from} → {form.to}</strong></div>
            {buses.map(bus => (
              <div key={bus.id} className="bus-card">
                <div>
                  <div className="bus-name">{bus.busName}</div>
                  <div className="bus-number">Bus No: {bus.busNumber}</div>
                  <div className="bus-route">📍 {bus.source} <span style={{ color: '#94a3b8' }}>→</span> {bus.destination}</div>
                  <div className="bus-times">
                    <span>🕐 Departs: <strong>{bus.departureTime}</strong></span>
                    <span>🕐 Arrives: <strong>{bus.arrivalTime}</strong></span>
                  </div>
                </div>
                <div className="bus-meta">
                  <div className="fare">₹{bus.fare}</div>
                  <div className="seats-left">✅ {bus.availableSeats} seats left</div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal(bus)}
                    disabled={bus.availableSeats === 0}
                  >
                    {bus.availableSeats === 0 ? '❌ Full' : '🎫 Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </>
      )}

      {/* Booking Modal */}
      {selectedBus && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>

            {ticket ? (
              /* ── Ticket Confirmed ── */
              <>
                <div style={{ textAlign: 'center', fontSize: '2.5rem' }}>🎉</div>
                <h3 className="modal-title" style={{ textAlign: 'center', marginTop: '.5rem' }}>Booking Confirmed!</h3>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', fontSize: '.875rem', lineHeight: '2' }}>
                  <p>🎫 <strong>Ticket No:</strong> {ticket.ticketNumber}</p>
                  <p>👤 <strong>Passenger:</strong> {ticket.passengerName}</p>
                  <p>🚌 <strong>Bus:</strong> {ticket.busName} ({ticket.busNumber})</p>
                  <p>💺 <strong>Seat No:</strong> <span style={{ background: '#1e40af', color: '#fff', padding: '.2rem .6rem', borderRadius: '6px', fontWeight: 700 }}>{ticket.seatNumber}</span></p>
                  <p>📍 <strong>Route:</strong> {ticket.fromPlace} → {ticket.toPlace}</p>
                  <p>📅 <strong>Journey Date:</strong> {ticket.journeyDate}</p>
                  <p>🕐 <strong>Departure:</strong> {ticket.departureTime}</p>
                  <p>💰 <strong>Fare:</strong> ₹{ticket.fare}</p>
                  <p>📌 <strong>Status:</strong> <span className="badge badge-success">{ticket.status}</span></p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={closeModal}>✅ Done</button>
                </div>
              </>
            ) : (
              /* ── Booking Form ── */
              <>
                <h3 className="modal-title">🎫 Book Ticket — {selectedBus.busName}</h3>

                <div className="hint-box">
                  <strong>{selectedBus.source} → {selectedBus.destination}</strong> &nbsp;|&nbsp;
                  🕐 {selectedBus.departureTime} &nbsp;|&nbsp; ₹{selectedBus.fare}
                </div>

                {bookingError && <div className="alert alert-error">{bookingError}</div>}

                <form onSubmit={handleBook}>
                  <div className="form-group">
                    <label>Passenger Name</label>
                    <input
                      placeholder="Full passenger name"
                      value={bookingForm.passengerName}
                      onChange={e => setBookingForm({ ...bookingForm, passengerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Journey Date</label>
                    <input
                      type="date"
                      value={bookingForm.journeyDate}
                      onChange={e => setBookingForm({ ...bookingForm, journeyDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* ── Seat Selection Grid ── */}
                  <div className="form-group">
                    <label>Select Your Seat {selectedSeat && <span style={{ color: '#16a34a' }}>— Seat {selectedSeat} Selected ✅</span>}</label>

                    {seatsLoading
                      ? <div className="loading" style={{ padding: '1rem' }}><div className="spinner" /> Loading seats...</div>
                      : <>
                        {/* Legend */}
                        <div className="seat-legend">
                          <div className="legend-item">
                            <div className="legend-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }} />
                            <span>Available</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-box" style={{ background: '#1e40af', borderColor: '#1e40af' }} />
                            <span>Selected</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-box" style={{ background: '#fee2e2', borderColor: '#fca5a5' }} />
                            <span>Booked</span>
                          </div>
                        </div>

                        {/* Seat Grid */}
                        <div className="seat-grid">
                          {allSeatNumbers.map(seat => {
                            const isBooked = bookedSeats.includes(seat)
                            const isSelected = selectedSeat === seat
                            return (
                              <button
                                key={seat}
                                type="button"
                                className={`seat-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => !isBooked && setSelectedSeat(seat)}
                                disabled={isBooked}
                                title={isBooked ? 'Already Booked' : `Select Seat ${seat}`}
                              >
                                {isBooked ? '🚫' : `${seat}`}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    }
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={bookingLoading || !selectedSeat}
                    >
                      {bookingLoading ? 'Booking...' : `✅ Book Seat ${selectedSeat || ''}`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
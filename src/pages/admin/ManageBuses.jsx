import { useState, useEffect } from 'react'
import api from '../../api/axios'

const empty = { busNumber:'', busName:'', source:'', destination:'', departureTime:'', arrivalTime:'', availableSeats:'', fare:'' }

export default function ManageBuses() {
  const [buses, setBuses]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError]       = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(empty)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError]     = useState('')

  const fetchBuses = async () => {
    setLoading(true)
    try { const res = await api.get('/admin/buses'); setBuses(res.data.data || []) }
    catch { setError('Failed to load buses.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBuses() }, [])

  const flash = msg => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  const openAdd  = () => { setForm(empty); setEditId(null); setFormError(''); setShowForm(true) }
  const openEdit = bus => {
    setForm({ busNumber:bus.busNumber, busName:bus.busName, source:bus.source, destination:bus.destination,
              departureTime:bus.departureTime, arrivalTime:bus.arrivalTime, availableSeats:bus.availableSeats, fare:bus.fare })
    setEditId(bus.id); setFormError(''); setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty); setFormError('') }

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setFormError('') }

  const handleSubmit = async e => {
    e.preventDefault(); setFormLoading(true); setFormError('')
    const payload = { ...form, availableSeats: parseInt(form.availableSeats), fare: parseFloat(form.fare) }
    try {
      if (editId) { await api.put(`/admin/buses/${editId}`, payload); flash('✅ Bus updated successfully!') }
      else        { await api.post('/admin/buses', payload);           flash('✅ Bus added successfully!') }
      closeForm(); fetchBuses()
    } catch (err) {
      const d = err.response?.data
      if (d?.data && typeof d.data === 'object') setFormError(Object.values(d.data).join(', '))
      else setFormError(d?.message || 'Something went wrong.')
    } finally { setFormLoading(false) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete bus "${name}"? This cannot be undone.`)) return
    try { await api.delete(`/admin/buses/${id}`); flash('✅ Bus deleted successfully!'); fetchBuses() }
    catch (err) { setError(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <div className="page">
      <h2 className="page-title">🚌 Manage Buses</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error      && <div className="alert alert-error">{error}</div>}

      <div className="section-header">
        <span className="section-title">All Buses ({buses.length})</span>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add New Bus</button>
      </div>

      {loading
        ? <div className="loading"><div className="spinner"/> Loading buses...</div>
        : buses.length === 0
          ? <div className="empty"><div className="empty-icon">🚌</div><div className="empty-text">No buses added yet.</div></div>
          : <div className="card table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Bus No</th><th>Bus Name</th><th>Route</th>
                    <th>Departure</th><th>Arrival</th><th>Seats</th><th>Fare</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus, i) => (
                    <tr key={bus.id}>
                      <td>{i+1}</td>
                      <td><strong>{bus.busNumber}</strong></td>
                      <td>{bus.busName}</td>
                      <td>{bus.source} → {bus.destination}</td>
                      <td>{bus.departureTime}</td>
                      <td>{bus.arrivalTime}</td>
                      <td><span className={`badge ${bus.availableSeats > 0 ? 'badge-success' : 'badge-danger'}`}>{bus.availableSeats}</span></td>
                      <td><strong>₹{bus.fare}</strong></td>
                      <td>
                        <div style={{display:'flex',gap:'.4rem'}}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(bus)}>✏️ Edit</button>
                          <button className="btn btn-danger btn-sm"  onClick={() => handleDelete(bus.id, bus.busName)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      }

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <div className="modal" style={{maxWidth:'580px'}} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editId ? '✏️ Update Bus' : '➕ Add New Bus'}</h3>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Bus Number</label>
                  <input name="busNumber" placeholder="e.g. AP-101" value={form.busNumber} onChange={handleChange} required/></div>
                <div className="form-group"><label>Bus Name</label>
                  <input name="busName" placeholder="e.g. Vijay Travels" value={form.busName} onChange={handleChange} required/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Source (From)</label>
                  <input name="source" placeholder="e.g. Hyderabad" value={form.source} onChange={handleChange} required/></div>
                <div className="form-group"><label>Destination (To)</label>
                  <input name="destination" placeholder="e.g. Chennai" value={form.destination} onChange={handleChange} required/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Departure Time</label>
                  <input type="time" name="departureTime" value={form.departureTime} onChange={handleChange} required/></div>
                <div className="form-group"><label>Arrival Time</label>
                  <input type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} required/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Available Seats</label>
                  <input type="number" name="availableSeats" placeholder="e.g. 40" value={form.availableSeats} onChange={handleChange} min="1" required/></div>
                <div className="form-group"><label>Fare (₹)</label>
                  <input type="number" name="fare" placeholder="e.g. 850" value={form.fare} onChange={handleChange} min="1" step="0.01" required/></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? (editId ? 'Updating...' : 'Adding...') : (editId ? '✅ Update Bus' : '✅ Add Bus')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', password:'', phoneNumber:'' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await api.post('/users/register', form)
      if (res.data.success) {
        setSuccess('✅ Registration successful! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      const d = err.response?.data
      if (d?.data && typeof d.data === 'object') setError(Object.values(d.data).join(', '))
      else setError(d?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-icon">📝</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Register to book your bus tickets</p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input name="name" placeholder="Choose a username" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Minimum 6 characters" value={form.password} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" placeholder="10-digit phone number" value={form.phoneNumber} onChange={handle} required maxLength={10} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop:'.5rem'}}>
            {loading ? 'Registering...' : '✅ Register'}
          </button>
        </form>

        <div className="auth-link">Already have an account? <Link to="/login">Login here</Link></div>
      </div>
    </div>
  )
}

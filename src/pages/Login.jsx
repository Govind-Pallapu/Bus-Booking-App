import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ name: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await api.post('/users/login', form)
      if (res.data.success) {
        login(res.data.data)
        navigate(res.data.data.role === 'ADMIN' ? '/admin' : '/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-icon">🚌</div>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-sub">Login to your Bus Booking account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input name="name" placeholder="Enter your username" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop:'.5rem'}}>
            {loading ? 'Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div className="auth-link">Don't have an account? <Link to="/register">Register here</Link></div>

        <div className="hint-box" style={{marginTop:'1rem'}}>
          <strong>Default Admin:</strong> admin / admin123
        </div>
      </div>
    </div>
  )
}

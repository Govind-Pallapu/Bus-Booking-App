import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AdminUsers() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/users/all')
        setUsers(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users.')
      } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phoneNumber?.includes(search)
  )

  if (loading) return <div className="page"><div className="loading"><div className="spinner"/> Loading users...</div></div>

  return (
    <div className="page">
      <h2 className="page-title">👥 All Users</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search */}
      <div style={{marginBottom:'1rem'}}>
        <input
          className="form-group input"
          style={{padding:'.65rem .9rem',border:'1.5px solid #e2e8f0',borderRadius:'8px',width:'100%',maxWidth:'350px',fontSize:'.9rem',outline:'none'}}
          placeholder="🔍  Search by name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="section-header">
        <span className="section-title">Total Users: {users.length}</span>
        <span style={{fontSize:'.85rem',color:'#64748b'}}>Showing {filtered.length} result(s)</span>
      </div>

      {filtered.length === 0
        ? <div className="empty"><div className="empty-icon">👥</div><div className="empty-text">No users found.</div></div>
        : <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phoneNumber}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                        {u.role === 'ADMIN' ? '🛡️ ADMIN' : '👤 USER'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}

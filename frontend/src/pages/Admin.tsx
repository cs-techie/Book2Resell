import { useEffect, useState } from 'react'
import { api, Book } from '../services/api'
import { pushToast } from '../components/Toast'

// Basic approach: request admin token by logging in with static credentials from env/ui (demo).
// For simplicity here, we reuse user token and rely on backend admin check. Provide a quick login form.

export default function Admin() {
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [email, setEmail] = useState('admin@book2resell.local')
  const [password, setPassword] = useState('admin123')
  const [authed, setAuthed] = useState(false)

  const adminLogin = async () => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      setAuthed(true)
      pushToast({ type: 'success', message: 'Admin logged in' })
      load()
    } catch {
      pushToast({ type: 'error', message: 'Admin login failed' })
    }
  }

  const load = async () => {
    try {
      const [b, u] = await Promise.all([
        api.get('/api/admin/books'),
        api.get('/api/admin/users'),
      ])
      setBooks(b.data)
      setUsers(u.data)
    } catch {
      // ignore until authed
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this listing?')) return
    try {
      await api.delete(`/api/admin/books/${id}`)
      pushToast({ type: 'success', message: 'Deleted' })
      load()
    } catch {
      pushToast({ type: 'error', message: 'Failed to delete' })
    }
  }

  useEffect(() => { if (authed) load() }, [authed])

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn w-full" onClick={adminLogin}>Login</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.is_admin ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Books</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {books.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-600">{b.author}</div>
              <div className="pt-1 font-medium">${b.price.toFixed(2)}</div>
              <button className="btn mt-3 px-3 py-1" onClick={() => remove(b.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


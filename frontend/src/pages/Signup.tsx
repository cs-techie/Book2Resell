import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { pushToast } from '../components/Toast'

export default function Signup() {
  const { signup, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', contact_no: '' })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await signup(form)
    if (ok) {
      await login(form.email, form.password)
      pushToast({ type: 'success', message: 'Account created!' })
      navigate('/')
    } else {
      pushToast({ type: 'error', message: 'Signup failed' })
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Signup</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="input" placeholder="College" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
        <input className="input" placeholder="Contact No" value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} />
        <button className="btn w-full" disabled={loading}>{loading ? 'Loading...' : 'Create account'}</button>
      </form>
      <p className="text-sm text-gray-600">Already have an account? <Link className="text-brand" to="/login">Login</Link></p>
    </div>
  )
}


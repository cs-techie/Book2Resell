import { useEffect, useState } from 'react'
import { api, Book } from '../services/api'
import { pushToast } from '../components/Toast'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/books/me/listings')
      setBooks(res.data)
    } catch {
      pushToast({ type: 'error', message: 'Failed to load your listings' })
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this listing?')) return
    try {
      await api.delete(`/api/books/${id}`)
      pushToast({ type: 'success', message: 'Deleted' })
      load()
    } catch {
      pushToast({ type: 'error', message: 'Failed to delete' })
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-3xl font-bold text-white ring-4 ring-white/30">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="mt-1 text-primary-100">{user?.email || 'Welcome back!'}</p>
          </div>
          <div className="hidden sm:block rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2 text-white border border-white/20">
            <div className="text-sm text-primary-100">Total Listings</div>
            <div className="text-2xl font-bold">{books.length}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{books.length}</p>
            </div>
            <div className="rounded-lg bg-primary-50 p-3">
              <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ₹{Math.round(books.reduce((sum, b) => sum + b.price, 0))}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ₹{books.length > 0 ? Math.round(books.reduce((sum, b) => sum + b.price, 0) / books.length) : '0'}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* My Listings Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
            <p className="mt-1 text-sm text-gray-600">Manage your books for sale</p>
          </div>
          <a 
            href="/sell" 
            className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-primary-600 hover:to-primary-700"
          >
            + Add New Book
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-sm text-gray-600">Loading your listings...</p>
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">No listings yet</h3>
            <p className="mt-2 text-sm text-gray-600">Start selling your books to reach thousands of buyers</p>
            <a 
              href="/sell" 
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List Your First Book
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((b) => (
              <div 
                key={b.id} 
                className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-primary-300 hover:shadow-md"
              >
                {/* Book Image */}
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{b.title}</h3>
                  <p className="text-sm text-gray-600 truncate">by {b.author}</p>
                  {b.category && (
                    <span className="mt-1 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {b.category}
                    </span>
                  )}
                  {b.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">{b.description}</p>
                  )}
                </div>

                {/* Price */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-xl font-bold text-primary-600">₹{Math.round(b.price)}</div>
                  <div className="text-xs text-gray-500">Listed price</div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 gap-2">
                  <button 
                    onClick={() => remove(b.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


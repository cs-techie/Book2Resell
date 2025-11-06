import { useEffect, useState } from 'react'
import { api, Book } from '../services/api'
import BookCard from '../components/BookCard'
import { SkeletonCard } from '../components/Skeleton'
import { pushToast } from '../components/Toast'
import Modal from '../components/Modal'
import { useCart } from '../context/CartContext'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 2000])
  const [sortBy, setSortBy] = useState('newest')
  const [selected, setSelected] = useState<Book | null>(null)
  const [showCart, setShowCart] = useState(false)
  const { cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart()

  const categories = ['Fiction', 'Non-Fiction', 'Textbook', 'Novel', 'Science', 'History', 'Biography']

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (q) params.q = q
      if (category) params.category = category
      const res = await api.get('/api/books/', { params })
      setBooks(res.data.items)
      applyFilters(res.data.items)
    } catch (e) {
      pushToast({ type: 'error', message: 'Failed to load books' })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (bookList: Book[] = books) => {
    let filtered = [...bookList]

    // Apply price range filter
    filtered = filtered.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id)
        break
    }

    setFilteredBooks(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [priceRange, sortBy])

  useEffect(() => { fetchBooks() }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 shadow-lg md:p-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">Buy Second Hand Books Online</h1>
          <p className="mt-3 text-lg text-primary-50">India's Largest Online Book Store - Find great deals on used books</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input 
              className="input max-w-xl flex-1" 
              placeholder="Search by title, author, or ISBN" 
              value={q} 
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
            />
            <button className="btn bg-white px-8 text-primary-600 hover:bg-gray-50" onClick={fetchBooks}>Search</button>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <button 
            onClick={() => { setCategory(''); fetchBooks() }}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${!category ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-primary-300'}`}
          >
            All Books
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => { setCategory(cat); fetchBooks() }}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${category === cat ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-primary-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Sidebar - Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-4">
            {/* Filter Header */}
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-gray-700">Price Range</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="input w-full px-2 py-1.5 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      type="number" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="input w-full px-2 py-1.5 text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-gray-700">Quick Filters</label>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setPriceRange([200, 300])}
                    className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-700"
                  >
                    ₹200 - ₹300
                  </button>
                  <button 
                    onClick={() => setPriceRange([300, 500])}
                    className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-700"
                  >
                    ₹300 - ₹500
                  </button>
                  <button 
                    onClick={() => setPriceRange([500, 1000])}
                    className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-700"
                  >
                    ₹500 - ₹1000
                  </button>
                  <button 
                    onClick={() => setPriceRange([200, 2000])}
                    className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-700"
                  >
                    All Prices
                  </button>
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input w-full"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content - Books */}
        <main className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Available Books</h2>
            <span className="text-sm text-gray-600">{filteredBooks.length} books found</span>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">No books found</h3>
              <p className="mt-2 text-sm text-gray-600">Try adjusting your filters or browse all categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBooks.map((b) => (
                <BookCard key={b.id} title={b.title} author={b.author} price={b.price} category={b.category} image_url={b.image_url} onView={() => setSelected(b)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={!!selected} title="" onClose={() => setSelected(null)}>
        <div className="space-y-4">
          {/* Book Details Section */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Book Image */}
            {selected?.image_url && (
              <div className="w-full sm:w-32 flex-shrink-0">
                <img src={selected.image_url} alt={selected.title} className="w-full rounded-lg object-cover shadow-sm" />
              </div>
            )}
            
            {/* Book Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected?.title}</h2>
                <p className="text-xs text-gray-600">by {selected?.author}</p>
              </div>
              
              {selected?.category && (
                <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                  {selected.category}
                </span>
              )}
              
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary-600">₹{selected?.price}</span>
                <span className="text-sm text-gray-400 line-through">₹{selected?.price ? Math.round(selected.price * 1.5) : 0}</span>
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">33% OFF</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs font-semibold text-gray-700 mb-1">Description</div>
            <p className="text-xs leading-relaxed text-gray-600 line-clamp-2">{selected?.description || 'No description provided.'}</p>
          </div>

          {/* Seller Information */}
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                D
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-900">Demo Student</div>
                <div className="text-xs text-gray-500">Seller</div>
              </div>
              <button className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition hover:bg-primary-100">
                <svg className="inline-block h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </button>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-blue-50 p-2">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div>
                  <div className="text-xs font-semibold text-blue-900">Cash on Delivery</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-2">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-xs font-semibold text-green-900">Quality Checked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (selected) {
                  addToCart({ id: selected.id, title: selected.title, author: selected.author, price: selected.price, image_url: selected.image_url })
                  pushToast({ type: 'success', message: 'Added to cart!' })
                  setSelected(null)
                }
              }}
              className="flex-1 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-primary-600 hover:to-primary-700"
            >
              <svg className="inline-block h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Buy Now
            </button>
            <button 
              onClick={() => {
                if (selected) {
                  addToCart({ id: selected.id, title: selected.title, author: selected.author, price: selected.price, image_url: selected.image_url })
                  pushToast({ type: 'success', message: 'Added to cart!' })
                }
              }}
              className="flex-1 rounded-lg border-2 border-primary-500 bg-white px-4 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              <svg className="inline-block h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </Modal>

      {/* Floating Cart Button */}
      <button
        data-cart-trigger
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-2xl transition hover:scale-110 hover:shadow-3xl"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-bold text-gray-900">Shopping Cart ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="rounded-full p-2 hover:bg-gray-100">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-1">Add some books to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-lg border border-gray-200 p-3">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="h-20 w-16 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                          <p className="text-xs text-gray-500">{item.author}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-primary-600">₹{item.price}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Subtotal ({cartCount} items)</span>
                    <span className="text-lg font-bold text-gray-900">₹{Math.round(cartTotal)}</span>
                  </div>
                  <button className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 py-3 font-semibold text-white shadow-lg transition hover:from-primary-600 hover:to-primary-700">
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


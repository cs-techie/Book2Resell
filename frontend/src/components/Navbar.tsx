import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/sell')) {
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-xl font-bold text-white shadow-md">
            B2R
          </div>
          <span className="text-xl font-bold text-gray-900">Book2Resell</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <NavItem to="/" currentPath={location.pathname} label="Home" />
          <NavItem to="/sell" currentPath={location.pathname} label="Sell" />
          
          {/* Cart Button */}
          {location.pathname === '/' && (
            <button
              onClick={() => {
                const cartButton = document.querySelector('[data-cart-trigger]') as HTMLButtonElement
                if (cartButton) cartButton.click()
              }}
              className="relative rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          
          {isAuthenticated ? (
            <>
              <NavItem to="/profile" currentPath={location.pathname} label="Profile" />
              <button className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-medium text-white transition hover:from-red-600 hover:to-red-700" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100">
                Login
              </Link>
              <Link to="/signup" className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 font-medium text-white shadow-md transition hover:from-primary-600 hover:to-primary-700">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function NavItem({ to, label, currentPath }: { to: string, label: string, currentPath: string }) {
  const active = currentPath === to
  return (
    <Link 
      to={to} 
      className={`rounded-lg px-3 py-2 font-medium transition ${
        active 
          ? 'bg-primary-50 text-primary-600' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </Link>
  )
}


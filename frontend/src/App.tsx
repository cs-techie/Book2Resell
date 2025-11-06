import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sell from './pages/Sell'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastHost } from './components/Toast'
import { useAuth } from './hooks/useAuth'
import { CartProvider } from './context/CartContext'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="px-4 py-6 lg:px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/sell" element={isAuthenticated ? <Sell /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastHost />
      </div>
    </CartProvider>
  )
}

export default App


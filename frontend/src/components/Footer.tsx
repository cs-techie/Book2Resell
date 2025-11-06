export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-xl font-bold text-white">
                B2R
              </div>
              <span className="text-lg font-bold text-gray-900">Book2Resell</span>
            </div>
            <p className="text-sm text-gray-600 max-w-sm">
              India's premier platform for buying and selling second-hand books. Get the best deals on used books from students and readers across the country.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-primary-600 transition">Home</a></li>
              <li><a href="/sell" className="hover:text-primary-600 transition">Sell Books</a></li>
              <li><a href="/profile" className="hover:text-primary-600 transition">My Profile</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-600 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-600 transition">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Book2Resell. All rights reserved. Built with FastAPI & React</p>
        </div>
      </div>
    </footer>
  )
}


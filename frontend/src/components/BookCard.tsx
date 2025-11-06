type Props = {
  title: string
  author: string
  price: number
  category?: string
  image_url?: string
  onView?: () => void
}

export default function BookCard({ title, author, price, category, image_url, onView }: Props) {
  // Calculate a mock discount (20-50% for visual appeal)
  const discount = Math.floor(Math.random() * 31) + 20
  const originalPrice = price / (1 - discount / 100)
  
  return (
    <div className="card group overflow-hidden relative">
      {/* Discount Badge */}
      <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
        {discount}% OFF
      </div>
      
      <div className="aspect-[3/4] w-full bg-gray-100">
        {image_url ? (
          <img src={image_url} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div className="text-xs">No Image</div>
          </div>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <div className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900">{title}</div>
        <div className="text-xs text-gray-500 truncate">{author}</div>
        {category && (
          <div className="text-xs text-primary-600 font-medium">{category}</div>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <div className="text-base font-bold text-gray-900">₹{Math.round(price)}</div>
            <div className="text-xs text-gray-400 line-through">₹{Math.round(originalPrice)}</div>
          </div>
          {onView && (
            <button className="rounded-md bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-600" onClick={onView}>
              View
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


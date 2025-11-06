import { useState, useRef } from 'react'
import { api } from '../services/api'
import { pushToast } from '../components/Toast'

export default function Sell() {
  const [form, setForm] = useState({ title: '', author: '', category: '', price: 0, description: '', image_url: '' })
  const [loading, setLoading] = useState(false)
  const [customCategory, setCustomCategory] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const predefinedCategories = [
    'Fiction',
    'Non-Fiction',
    'Textbook',
    'Novel',
    'Science',
    'History',
    'Biography',
    'Self-Help',
    'Business',
    'Technology',
    'Religion',
    'Poetry',
    'Comics',
    'Children',
    'Romance',
    'Thriller',
    'Other'
  ]

  // Check if all required fields are filled
  const isFormValid = form.title.trim() && form.author.trim() && form.category.trim() && form.price > 0

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setCustomCategory(true)
      setForm({ ...form, category: '' })
    } else {
      setCustomCategory(false)
      setForm({ ...form, category: value })
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setSelectedImages(prev => [...prev, ...fileArray])
      // For now, just set a placeholder URL. In production, you'd upload to cloud storage
      const imageUrls = fileArray.map(f => URL.createObjectURL(f)).join(', ')
      setForm({ ...form, image_url: imageUrls })
      pushToast({ type: 'success', message: `${fileArray.length} image(s) selected` })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/books/', form)
      setForm({ title: '', author: '', category: '', price: 0, description: '', image_url: '' })
      pushToast({ type: 'success', message: 'Book listed successfully!' })
    } catch (e) {
      pushToast({ type: 'error', message: 'Failed to list book' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Sell Your Book</h1>
        <p className="mt-2 text-primary-50">List your book and reach thousands of buyers</p>
      </div>

      <form className="space-y-5 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100" onSubmit={onSubmit}>
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Book Title *</label>
          <input 
            className="input" 
            placeholder="Enter book title" 
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })} 
            required 
          />
        </div>

        {/* Author */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Author Name *</label>
          <input 
            className="input" 
            placeholder="Enter author name" 
            value={form.author} 
            onChange={(e) => setForm({ ...form, author: e.target.value })} 
            required 
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Category Dropdown */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
            {!customCategory ? (
              <div className="space-y-2">
                <select 
                  className="input" 
                  value={form.category} 
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {predefinedCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">+ Add Custom Category</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <input 
                  className="input" 
                  placeholder="Enter custom category" 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setCustomCategory(false)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  ← Back to predefined categories
                </button>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (₹) *</label>
            <input 
              className="input" 
              placeholder="200" 
              type="number" 
              min={200} 
              step={10} 
              value={form.price || ''} 
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
              required 
            />
            <p className="mt-1 text-xs text-gray-500">Minimum price: ₹200</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea 
            className="input h-32" 
            placeholder="Add details about book condition, edition, etc." 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Book Images (Optional)</label>
          <p className="mb-2 text-xs text-gray-500">Upload images from all sides for better visibility</p>
          
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-gray-600 transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium">Click to insert book images</p>
              <p className="text-sm">Upload from all angles (front, back, spine, inside)</p>
            </div>
          </button>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index + 1}`} 
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          className="btn w-full bg-gradient-to-r from-primary-500 to-primary-600 py-3 text-lg font-semibold hover:from-primary-600 hover:to-primary-700" 
          disabled={loading || !isFormValid}
        >
          {loading ? 'Listing Your Book...' : 'List Book for Sale'}
        </button>
        
        {!isFormValid && (
          <p className="text-center text-sm text-red-600">Please fill in all required fields (Title, Author, Category, and Price)</p>
        )}
      </form>
    </div>
  )
}


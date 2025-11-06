type ModalProps = {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 my-8 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        {title && (
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <h3 className="text-base font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100">✕</button>
          </div>
        )}
        {!title && (
          <div className="absolute right-3 top-3 z-20">
            <button onClick={onClose} className="rounded-full bg-white p-1.5 text-gray-500 shadow-md hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}


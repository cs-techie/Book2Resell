import { useEffect, useState } from 'react'

type Toast = { id: number, message: string, type: 'success' | 'error' }

let pushToastRef: (t: Omit<Toast, 'id'>) => void

export function pushToast(t: Omit<Toast, 'id'>) {
  if (pushToastRef) pushToastRef(t)
}

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    pushToastRef = (t) => {
      const toast: Toast = { id: Date.now(), ...t }
      setToasts((prev) => [...prev, toast])
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== toast.id)), 3000)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto flex max-w-md flex-col gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto rounded-md border px-4 py-2 shadow ${t.type === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}


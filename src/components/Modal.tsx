'use client'

import { useState, useEffect } from 'react'

interface ModalProps {
  onClose: () => void
  onSave: (todo: any) => void
  initialData?: any
}

export default function Modal({ onClose, onSave, initialData }: ModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'pending' | 'in progress' | 'completed'>('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setDueDate(initialData.dueDate)
      setStatus(initialData.status)
    }
  }, [initialData])

  const isFutureDate = (dateStr: string) => {
    const selectedDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }

  const handleSubmit = () => {
    if (!title || !dueDate) return setError("Title and due date are required.")
    if (!isFutureDate(dueDate)) return setError("Due date must be today or later.")

    const todo = {
      id: initialData?.id ?? Date.now(),
      title,
      description,
      dueDate,
      status,
    }

    setError('')
    onSave(todo)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Update Task' : 'Create Task'}</h2>
        <input
          type="text"
          className="w-full mb-3 px-3 py-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-3 px-3 py-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full mb-3 px-3 py-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="w-full mb-3 px-3 py-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

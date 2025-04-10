"use client"

import { useState } from "react"

interface AIModalProps {
  onClose: () => void
  onSave: (value: string) => void
  initialValue?: string
}

export default function AI({ onClose, onSave, initialValue = "" }: AIModalProps) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!value.trim()) {
      setError("Input cannot be empty.")
      return
    }

    setError("")
    onSave(value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Enter Value</h2>
        <input
          type="text"
          className="w-full mb-3 px-3 py-2 border rounded"
          placeholder="Enter something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

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
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
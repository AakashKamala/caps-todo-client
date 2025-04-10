'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import axios from 'axios'
import { BACKEND_URL } from '@/config/config'
import { useRouter } from 'next/navigation'
import AI from '@/components/AI'

interface Todo {
  id: any
  _id: any
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [del, setDel] = useState(0)
  const [ai, setAi] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(!token){
      router.push('/login')
    }
    const fetchTodos = async () => {
      const res = await axios.get(`${BACKEND_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(res.data)
      setTodos(res.data)
    }
    fetchTodos()
  }, [isModalOpen, del])

  const handleCreateClick = () => {
    setEditingTodo(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    console.log(id)
    const token = localStorage.getItem("token")
    await axios.delete(`${BACKEND_URL}/todos/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    })
    console.log(id)
    setTodos(todos.filter((todo) => todo.id !== id))
    setDel(del=>del+1)
  }

  const handleSave = async (todo: Todo) => {
    const token = localStorage.getItem("token")
  try {
    if (editingTodo) {
      // Update logic (if needed, send PATCH/PUT to backend too)
      // const updated = todos.map((t) => (t.id === todo.id ? todo : t))
      // setTodos(updated)
      const response = await axios.post(`${BACKEND_URL}/todos/update`, {
        todoId: todo.id,
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        status: todo.status
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Ensure response.data is the new todo
      const newTodo = response.data
      console.log(newTodo)

      // Add it to the UI
      setTodos((prev) => [...prev, newTodo])
    } else {
      // Create
      const response = await axios.post(`${BACKEND_URL}/todos`, {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        status: todo.status
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Ensure response.data is the new todo
      const newTodo = response.data
      console.log(newTodo)

      // Add it to the UI
      setTodos((prev) => [...prev, newTodo])
    }
  } catch (err) {
    console.error('Error saving todo:', err)
  } finally {
    setIsModalOpen(false)
  }
}


  const filteredTodos = Array.isArray(todos)
  ? todos
      .filter((todo) => filter === 'all' || todo.status === filter)
      .sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime()
        const dateB = new Date(b.dueDate).getTime()
        return sort === 'asc' ? dateA - dateB : dateB - dateA
      })
  : []


    function handleTalk(event:any): any {
        try {
            setAi(ai=>!ai)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleAsk(prompt: string) {
      try {
        const response = await axios.post(`${BACKEND_URL}/talk`, {
          prompt: prompt,
        });
    
        const responseText = response.data;
    
        // Try to extract JSON from a ```json block
        const match = responseText.match(/```json\n([\s\S]*?)```/i);
        const jsonText = match ? match[1] : responseText;
    
        // Attempt to parse the JSON
        const todo: Todo = JSON.parse(jsonText);
    
        console.log("Parsed Todo:", todo);
    
        // Save the todo
        handleSave(todo);
        setAi(ai=>!ai)
      } catch (error) {
        console.error("Error in handleAsk:", error);
      }
    }
    

  return (
    <div className="min-h-screen px-4 py-8 bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Todos</h1>
        <div className="space-x-4">
          <button
            onClick={handleCreateClick}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-md shadow"
          >
            + Create New Task
          </button>
          <button
            onClick={handleTalk}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-md shadow"
          >
            + talk to App
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <select
          className="px-3 py-1 rounded bg-white text-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="px-3 py-1 rounded bg-white text-black"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">Due Date: Ascending</option>
          <option value="desc">Due Date: Descending</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.1)] shadow"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{todo.title}</h2>
                <p className="text-sm opacity-70">{todo.description}</p>
                <p className="text-sm mt-1">Due Date: {todo.dueDate}</p>
                <span className="inline-block mt-1 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">
                  {todo.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(todo)}
                  className="text-blue-500 border border-[rgba(255,255,255,0.1)] px-2 py-1 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-500 border border-[rgba(255,255,255,0.1)] px-2 py-1 rounded"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          initialData={editingTodo}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {ai && (
        <AI
          onClose={() => setAi(false)}
          onSave={handleAsk}
        />
      )}
    </div>
  )
}

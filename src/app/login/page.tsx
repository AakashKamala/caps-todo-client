
'use client'

import { BACKEND_URL } from '@/config/config'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function LoginPage() {

    const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
          email,
          password
      })
  
      console.log(response)
      if(!response.data.token){
        // alert("email or password didn't match")
        toast.error("email or password didn't match")
    }
    else{
      localStorage.setItem("token", response.data.token)
      toast.success("login successful")
  
      router.push("/todo")
    }
    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md bg-[rgba(255,255,255,0.03)] text-[var(--foreground)] px-4 py-2 border border-[rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md bg-[rgba(255,255,255,0.03)] text-[var(--foreground)] px-4 py-2 border border-[rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 rounded-md transition duration-200"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center mt-4 opacity-80">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-[#6366f1] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

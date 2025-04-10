// app/signup/page.tsx
'use client'

import { BACKEND_URL } from '@/config/config'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {

    const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
    const response = await axios.post(`${BACKEND_URL}/register`, {
        username,
        email,
        password
    })

    console.log(response)
    localStorage.setItem("token", response.data.token)

    router.push("/todo")
    // You can add API call here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

        <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Username
            </label>
            <input
              id="username"
              type="username"
              className="w-full rounded-md bg-[rgba(255,255,255,0.03)] text-[var(--foreground)] px-4 py-2 border border-[rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>


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
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 opacity-80">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6366f1] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

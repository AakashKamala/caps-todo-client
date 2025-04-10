import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6">Stay Organized with Our Todo App</h1>
        <p className="text-lg text-gray-400 mb-8">
          Simplify your life and boost productivity with our sleek, minimalistic todo list. Focus on what matters most.
        </p>
        <Link
          href="/todo"
          className="inline-block bg-blue-600 hover:bg-blue-500 transition-colors text-white text-lg font-semibold px-6 py-3 rounded-2xl shadow-md"
        >
          Go to Todo App
        </Link>
      </div>
    </main>
  );
}

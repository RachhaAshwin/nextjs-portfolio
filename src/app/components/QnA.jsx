'use client';
import { useState } from 'react';

export default function Home() {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    async function createIndexAndEmbeddings() {
      try {
        const result = await fetch('/api/setup', {
          method: "POST"
        })
        const json = await result.json()
        console.log('result: ', json)
      } catch (err) {
        console.log('err:', err)
      }
    }
    async function sendQuery() {
      if (!query) return
      setResult('')
      setLoading(true)
      try {
        const result = await fetch('/api/read', {
          method: "POST",
          body: JSON.stringify(query)
        })
        const json = await result.json()
        setResult(json.data)
        setLoading(false)
      } catch (err) {
        console.log('err:', err)
        setLoading(false)
      }
    }
  

  return (
    <main className="flex flex-col items-center justify-between p-24 bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <input
        className="bg-gradient-to-r from-gray-300 to-gray-500 text-black px-4 py-2 rounded-md shadow-lg mb-4 w-1/2"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your question..."
      />
      <button 
        className="px-7 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-700 text-white mt-2 mb-2 shadow-md hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-800 transition duration-300"
        onClick={sendQuery}
      >
        Ask AI
      </button>
      {loading && <p className="text-gray-400">Asking AI ...</p>}
      {result && <p className="text-gray-300 bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 rounded-md shadow-lg w-1/2 text-center">{result}</p>}
      <button 
        onClick={createIndexAndEmbeddings}
        className="mt-4 px-7 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-700 text-white shadow-md hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-800 transition duration-300"
      >
        Create index and embeddings
      </button>
    </main>
  );
}
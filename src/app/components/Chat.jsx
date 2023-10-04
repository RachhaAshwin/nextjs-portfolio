'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="bg-gray-800 p-6 rounded-md shadow-lg mb-6">
      <div className="overflow-y-auto h-64 mb-4">
        {messages.map(m => (
          <div 
            key={m.id} 
            className={`mb-2 p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-700' : 'bg-green-700'}`}
          >
            <span className="font-bold text-white">{m.role}:</span> 
            <span className="text-white">{m.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <input 
          value={input} 
          placeholder="Say something..."
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md text-black"
        />
        <button 
          type="submit"
          className="mt-2 px-4 py-2 rounded-md bg-blue-500 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}

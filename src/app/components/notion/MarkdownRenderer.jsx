"use client";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const MarkdownRenderer = ({ markdown, pageTitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="prose prose-lg dark:prose-invert max-w-none"
    >
      {/* Custom styling for markdown content */}
      <style jsx global>{`
        .prose {
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          line-height: 1.7;
        }
        
        .prose h1 {
          color: #ffffff;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #9333ea, #06b6d4);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .prose h2 {
          color: #ffffff;
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #374151;
          padding-bottom: 0.5rem;
        }
        
        .prose h3 {
          color: #f3f4f6;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .prose p {
          color: #d1d5db;
          margin-bottom: 1.25rem;
          font-size: 1.125rem;
        }
        
        .prose a {
          color: #06b6d4;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }
        
        .prose a:hover {
          color: #0891b2;
          border-bottom-color: #06b6d4;
        }
        
        .prose blockquote {
          border-left: 4px solid #9333ea;
          background: rgba(147, 51, 234, 0.1);
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          font-style: italic;
        }
        
        .prose blockquote p {
          color: #e2e8f0;
          margin: 0;
        }
        
        .prose code {
          background: #374151;
          color: #06b6d4;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        }
        
        .prose pre {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.75rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .prose pre code {
          background: none;
          color: #e2e8f0;
          padding: 0;
          font-size: 0.875rem;
        }
        
        .prose ul, .prose ol {
          color: #d1d5db;
          margin: 1.25rem 0;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin: 0.5rem 0;
        }
        
        .prose strong {
          color: #ffffff;
          font-weight: 600;
        }
        
        .prose em {
          color: #f3f4f6;
          font-style: italic;
        }
        
        .prose hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #374151, transparent);
          margin: 2rem 0;
        }
        
        .prose img {
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          margin: 1.5rem 0;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: #1f2937;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .prose th {
          background: #374151;
          color: #ffffff;
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #4b5563;
        }
        
        .prose td {
          color: #d1d5db;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #374151;
        }
        
        .prose tr:last-child td {
          border-bottom: none;
        }
      `}</style>
      
      <ReactMarkdown
        components={{
          // Custom component overrides for better styling
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-8 mb-4 text-white border-b border-gray-600 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-100">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 mb-4 leading-relaxed text-lg">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 border-b border-transparent hover:border-cyan-400"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 bg-purple-500/10 pl-6 py-4 my-6 italic rounded-r-lg">
              <div className="text-gray-200">{children}</div>
            </blockquote>
          ),
          code: ({ inline, children }) => (
            inline ? (
              <code className="bg-gray-700 text-cyan-400 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto font-mono text-sm border border-gray-600">
                {children}
              </code>
            )
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 space-y-2 my-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 space-y-2 my-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 leading-relaxed">
              {children}
            </li>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </motion.div>
  );
};

export default MarkdownRenderer;

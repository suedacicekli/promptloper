'use client'

import { useState } from 'react'
import { Prompt } from '@/types'
import AIToolIcon, { getAIToolName } from './AIToolIcon'

interface PromptCardProps {
  prompt: Prompt
  onLike?: (id: string) => void
  onCopy?: (content: string) => void
}

export default function PromptCard({ prompt, onLike, onCopy }: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    setShowCopySuccess(true)

    if (prompt.aiTool) {
      setTimeout(() => {
        setShowCopySuccess(false)
      }, 3000)
    }

    onCopy?.(prompt.content)
  }

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* AI Tool Badge - Shows on hover */}
      {prompt.aiTool && isHovered && (
        <div className="absolute top-4 right-4 z-10 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <AIToolIcon tool={prompt.aiTool} size={18} />
            <span className="text-xs text-gray-300">Best with {getAIToolName(prompt.aiTool)}</span>
          </div>
        </div>
      )}

      {/* Copy Success Message */}
      {showCopySuccess && prompt.aiTool && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-green-600/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 text-white text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Copied! Use with <strong>{getAIToolName(prompt.aiTool)}</strong> for best results</span>
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <h2 className="card-title flex-1">{prompt.title}</h2>
          {prompt.aiTool && !isHovered && (
            <div className="shrink-0">
              <AIToolIcon tool={prompt.aiTool} size={20} />
            </div>
          )}
        </div>

        <div className="badge badge-secondary">{prompt.category}</div>
        <p className="text-sm opacity-70">{prompt.content}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {prompt.tags.map((tag, idx) => (
            <span key={idx} className="badge badge-outline">
              {tag}
            </span>
          ))}
        </div>

        <div className="card-actions justify-between items-center mt-4">
          <div className="text-sm opacity-60">
            by {prompt.author}
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => onLike?.(prompt.id)}
            >
              ❤️ {prompt.likes}
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleCopy}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

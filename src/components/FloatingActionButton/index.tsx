'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/contribute"
      className="fixed bottom-8 right-8 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
          isHovered ? 'opacity-75 scale-110' : 'opacity-50 scale-100'
        }`} style={{ background: 'linear-gradient(135deg, #C6F449 0%, #A8D840 50%, #8BC234 100%)' }} />

        {/* Button */}
        <button className={`relative flex items-center justify-center w-16 h-16 rounded-full text-black shadow-2xl transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`} style={{ background: 'linear-gradient(135deg, #C6F449 0%, #A8D840 50%, #8BC234 100%)' }}>
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Tooltip */}
        <div className={`absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}>
          <span className="text-sm font-medium">Contribute a Prompt</span>
          {/* Arrow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-800" />
          </div>
        </div>
      </div>
    </Link>
  )
}

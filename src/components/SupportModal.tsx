'use client'

import { useEffect, useState } from 'react'
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('supportModalDisabled', 'true')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            Enjoying Promptloper?
          </h2>

          <p className="text-gray-300 mb-6">
            I'm glad you're finding these prompts useful! If you'd like to support this project, consider buying me a coffee ☕
          </p>

          <div className="flex justify-center mb-4">
            <BuyMeCoffeeButton />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 accent-[#FFDD00] cursor-pointer"
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm text-gray-400 cursor-pointer select-none"
            >
              Don't show this again
            </label>
          </div>

          <button
            onClick={handleClose}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

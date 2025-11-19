'use client'

import Link from 'next/link'
import ContactForm from '@/components/ContributionForm'

export default function ContactPage() {
  return (
    <main className="min-h-screen w-full bg-black py-12 px-4 overflow-x-hidden">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      <ContactForm />
    </main>
  )
}

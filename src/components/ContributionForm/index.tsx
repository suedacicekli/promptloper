'use client'

import { useState, FormEvent } from 'react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvoldjay'

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-green-800/30" style={{ backgroundColor: '#1a1a1a' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-lime-400 bg-clip-text text-transparent mb-3">
            Contact Us
          </h2>
          <p className="text-green-100/70 text-sm sm:text-base">
            Share your suggestions, questions, or feedback with us
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="alert alert-success mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Thank you! Your message has been sent successfully.</span>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-green-100 font-medium">
                Name <span className="text-green-400">*</span>
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="input input-bordered bg-transparent text-white w-full focus:border-green-400 focus:outline-none border-green-800/50"
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-green-100 font-medium">
                Email <span className="text-green-400">*</span>
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="input input-bordered bg-transparent text-white w-full focus:border-green-400 focus:outline-none border-green-800/50"
              required
            />
          </div>

          {/* Subject */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-green-100 font-medium">
                Subject
              </span>
              <span className="label-text-alt text-green-300/60">Optional</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Message subject"
              className="input input-bordered bg-transparent text-white w-full focus:border-green-400 focus:outline-none border-green-800/50"
            />
          </div>

          {/* Message */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-green-100 font-medium">
                Message <span className="text-green-400">*</span>
              </span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your message here..."
              className="textarea textarea-bordered bg-transparent text-white h-40 w-full focus:border-green-400 focus:outline-none resize-none border-green-800/50"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-full text-lg h-12 border-none text-black font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#C6F449' }}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-md text-black"></span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center text-green-300/60 text-sm">
          <p>We typically respond within 24 hours</p>
        </div>

        {/* Contributor Section */}
        <div className="mt-10 pt-8 border-t border-green-800/30">
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-300 mb-3">
              Want to Contribute?
            </h3>
            <p className="text-green-100/70 text-sm mb-4 max-w-md mx-auto">
              Join our open-source community! Add your prompts directly by contributing to our GitHub repository.
            </p>
            <a
              href="https://github.com/suedacicekli/promptloper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-900/50 hover:bg-green-800/50 border border-green-700/50 text-green-100 transition-all duration-200 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-green-300"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-medium">View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

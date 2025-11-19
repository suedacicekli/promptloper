'use client'

import Image from 'next/image'
import { AITool } from '@/types'

interface AIToolIconProps {
  tool: AITool
  size?: number
  showLabel?: boolean
}

const AI_LOGOS: Record<AITool, { name: string; logo: string }> = {
  chatgpt: {
    name: 'ChatGPT',
    logo: '/asset/ai-logo/chatgpt-logo.png'
  },
  gemini: {
    name: 'Gemini',
    logo: '/asset/ai-logo/gemini-logo.png'
  },
  midjourney: {
    name: 'Midjourney',
    logo: '/asset/ai-logo/midjourney-logo.png'
  }
}

export default function AIToolIcon({ tool, size = 29, showLabel = false }: AIToolIconProps) {
  const logo = AI_LOGOS[tool]

  return (
    <div className="flex items-center gap-2">
      <Image
        src={logo.logo}
        alt={logo.name}
        width={size}
        height={size}
        className="object-contain"
      />
      {showLabel && (
        <span className="text-xs font-medium text-white">
          {logo.name}
        </span>
      )}
    </div>
  )
}

export function getAIToolName(tool: AITool): string {
  return AI_LOGOS[tool].name
}

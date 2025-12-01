'use client'

import { ReactNode } from 'react'

interface CalloutProps {
  icon?: string
  title?: string
  variant?: 'default' | 'accent' | 'subtle'
  children: ReactNode
}

export function Callout({ icon, title, variant = 'default', children }: CalloutProps) {
  const variantStyles = {
    default: 'bg-bg-tertiary border-border',
    accent: 'bg-accent-light border-accent',
    subtle: 'bg-bg-secondary border-border-light'
  }

  return (
    <div
      className={`my-6 p-4 sm:p-5 border-3 ${variantStyles[variant]}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {icon && (
          <span className="flex-shrink-0 text-2xl sm:text-3xl leading-none" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-display text-lg sm:text-xl text-text-primary mb-2">
              {title}
            </p>
          )}
          <div className="text-text-body text-sm sm:text-base [&>p]:m-0 [&>p:not(:last-child)]:mb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Callout

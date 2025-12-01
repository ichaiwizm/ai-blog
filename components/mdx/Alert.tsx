'use client'

import { ReactNode } from 'react'

type AlertType = 'info' | 'warning' | 'error' | 'success' | 'tip'

interface AlertProps {
  type?: AlertType
  title?: string
  children: ReactNode
}

const alertStyles: Record<AlertType, { bg: string; border: string; icon: string; iconBg: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-500',
    icon: 'i',
    iconBg: 'bg-blue-500 text-white'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-500',
    icon: '!',
    iconBg: 'bg-amber-500 text-white'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-500',
    icon: '×',
    iconBg: 'bg-red-500 text-white'
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-500',
    icon: '✓',
    iconBg: 'bg-emerald-500 text-white'
  },
  tip: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-500',
    icon: '★',
    iconBg: 'bg-violet-500 text-white'
  }
}

const defaultTitles: Record<AlertType, string> = {
  info: 'Information',
  warning: 'Attention',
  error: 'Erreur',
  success: 'Succès',
  tip: 'Astuce'
}

export function Alert({ type = 'info', title, children }: AlertProps) {
  const styles = alertStyles[type]
  const displayTitle = title || defaultTitles[type]

  return (
    <div
      className={`my-6 border-l-4 ${styles.border} ${styles.bg} p-4 sm:p-5`}
      role="alert"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold ${styles.iconBg}`}
        >
          {styles.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary mb-1 text-sm sm:text-base">
            {displayTitle}
          </p>
          <div className="text-text-body text-sm sm:text-base [&>p]:m-0 [&>p:not(:last-child)]:mb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert

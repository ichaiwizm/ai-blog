'use client'

import { useState, ReactNode, Children, isValidElement, ReactElement } from 'react'

interface TabProps {
  label?: string
  children: ReactNode
}

interface TabsProps {
  items: string[]
  defaultIndex?: number
  children: ReactNode
}

export function Tab({ children }: TabProps) {
  return <div>{children}</div>
}

export function Tabs({ items, defaultIndex = 0, children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const childrenArray = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> => isValidElement(child)
  )

  return (
    <div className="my-6 border-3 border-border bg-bg-secondary">
      {/* Tab buttons */}
      <div className="flex flex-wrap border-b-3 border-border overflow-x-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`
              px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider
              transition-colors duration-200 whitespace-nowrap touch-target
              ${
                activeIndex === index
                  ? 'bg-accent text-text-inverse'
                  : 'bg-bg-tertiary text-text-muted hover:bg-bg-primary hover:text-text-primary'
              }
              ${index !== items.length - 1 ? 'border-r-2 border-border' : ''}
            `}
            aria-selected={activeIndex === index}
            role="tab"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 sm:p-5" role="tabpanel">
        <div className="[&>p]:m-0 [&>pre]:m-0 [&>pre]:mt-0">
          {childrenArray[activeIndex]}
        </div>
      </div>
    </div>
  )
}

export default Tabs

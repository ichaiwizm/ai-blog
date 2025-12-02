'use client'

import { useState, useCallback } from 'react'
import NextImage from 'next/image'

interface ImageProps {
  src: string
  alt: string
  caption?: string
  credit?: string
  creditLink?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  align?: 'left' | 'center' | 'right'
  rounded?: boolean
  shadow?: boolean
  zoom?: boolean
  priority?: boolean
}

interface ImageGalleryProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
}

// Determine if image is local or external
function isLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//')
}

// Get image dimensions based on size prop
function getImageDimensions(size: ImageProps['size']) {
  switch (size) {
    case 'small':
      return { width: 400, height: 300 }
    case 'medium':
      return { width: 600, height: 400 }
    case 'large':
      return { width: 800, height: 500 }
    case 'full':
    default:
      return { width: 1200, height: 675 }
  }
}

// Main Image Component
export function Image({
  src,
  alt,
  caption,
  credit,
  creditLink,
  size = 'full',
  align = 'center',
  rounded = false,
  shadow = true,
  zoom = true,
  priority = false,
}: ImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const dimensions = getImageDimensions(size)
  const isLocal = isLocalImage(src)

  const handleZoomOpen = useCallback(() => {
    if (zoom && !hasError) {
      setIsZoomed(true)
      document.body.style.overflow = 'hidden'
    }
  }, [zoom, hasError])

  const handleZoomClose = useCallback(() => {
    setIsZoomed(false)
    document.body.style.overflow = ''
  }, [])

  // Alignment classes
  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  // Size classes for container width
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full',
  }

  if (hasError) {
    return (
      <figure className={`my-8 ${alignmentClasses[align]} ${sizeClasses[size]}`}>
        <div className="relative w-full aspect-video border-3 border-border bg-bg-tertiary flex items-center justify-center">
          <div className="text-center p-6">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-text-muted font-mono text-sm">Image non disponible</p>
          </div>
        </div>
      </figure>
    )
  }

  return (
    <>
      <figure className={`my-8 ${alignmentClasses[align]} ${sizeClasses[size]}`}>
        {/* Image Container */}
        <div
          className={`
            relative overflow-hidden
            border-3 border-border
            ${rounded ? 'rounded-lg' : ''}
            ${shadow ? 'shadow-brutal' : ''}
            ${zoom && !hasError ? 'cursor-zoom-in' : ''}
            ${!isLoaded ? 'animate-pulse bg-bg-tertiary' : ''}
            transition-all duration-200
            hover:shadow-brutal-hover hover:-translate-x-1 hover:-translate-y-1
          `}
          onClick={handleZoomOpen}
        >
          {/* Aspect ratio wrapper */}
          <div className="relative aspect-video">
            {isLocal ? (
              <NextImage
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                priority={priority}
                sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 80vw, ${dimensions.width}px`}
              />
            ) : (
              <NextImage
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                priority={priority}
                sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 80vw, ${dimensions.width}px`}
                unoptimized={!src.includes('unsplash.com')}
              />
            )}

            {/* Zoom indicator */}
            {zoom && isLoaded && (
              <div className="absolute bottom-3 right-3 p-2 bg-bg-inverse/80 border-2 border-border opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-text-inverse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Caption and Credit */}
        {(caption || credit) && (
          <figcaption className="mt-3 text-center">
            {caption && (
              <p className="text-text-body text-sm leading-relaxed">{caption}</p>
            )}
            {credit && (
              <p className="text-text-muted text-xs font-mono mt-1 uppercase tracking-wider">
                Photo:{' '}
                {creditLink ? (
                  <a
                    href={creditLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {credit}
                  </a>
                ) : (
                  credit
                )}
              </p>
            )}
          </figcaption>
        )}
      </figure>

      {/* Lightbox/Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-inverse/95 backdrop-blur-sm cursor-zoom-out"
          onClick={handleZoomClose}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-3 bg-bg-secondary border-3 border-border text-text-primary hover:bg-accent hover:text-text-inverse transition-colors z-10"
            onClick={handleZoomClose}
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoomed Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] border-3 border-border shadow-brutal-lg">
            {isLocal ? (
              <NextImage
                src={src}
                alt={alt}
                width={1920}
                height={1080}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
              />
            ) : (
              <NextImage
                src={src}
                alt={alt}
                width={1920}
                height={1080}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
                unoptimized={!src.includes('unsplash.com')}
              />
            )}
          </div>

          {/* Caption in lightbox */}
          {caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-bg-secondary border-3 border-border max-w-2xl">
              <p className="text-text-body text-sm text-center">{caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Image Gallery Component for multiple images
export function ImageGallery({
  children,
  columns = 2,
  gap = 'medium',
}: ImageGalleryProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }

  const gapClasses = {
    small: 'gap-3',
    medium: 'gap-4 md:gap-6',
    large: 'gap-6 md:gap-8',
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} my-8`}>
      {children}
    </div>
  )
}

// Compact image for use in galleries
export function GalleryImage({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const isLocal = isLocalImage(src)

  const handleZoomOpen = () => {
    setIsZoomed(true)
    document.body.style.overflow = 'hidden'
  }

  const handleZoomClose = () => {
    setIsZoomed(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <div className="group">
        <div
          className={`
            relative aspect-square overflow-hidden
            border-3 border-border
            cursor-zoom-in
            ${!isLoaded ? 'animate-pulse bg-bg-tertiary' : ''}
            transition-all duration-200
            hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5
          `}
          onClick={handleZoomOpen}
        >
          {isLocal ? (
            <NextImage
              src={src}
              alt={alt}
              fill
              className={`object-cover transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
              onLoad={() => setIsLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <NextImage
              src={src}
              alt={alt}
              fill
              className={`object-cover transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
              onLoad={() => setIsLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={!src.includes('unsplash.com')}
            />
          )}
        </div>
        {caption && (
          <p className="mt-2 text-text-muted text-xs font-mono text-center truncate">{caption}</p>
        )}
      </div>

      {/* Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-inverse/95 backdrop-blur-sm cursor-zoom-out"
          onClick={handleZoomClose}
        >
          <button
            className="absolute top-4 right-4 p-3 bg-bg-secondary border-3 border-border text-text-primary hover:bg-accent hover:text-text-inverse transition-colors z-10"
            onClick={handleZoomClose}
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-[90vw] max-h-[90vh] border-3 border-border shadow-brutal-lg">
            {isLocal ? (
              <NextImage
                src={src}
                alt={alt}
                width={1920}
                height={1080}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
              />
            ) : (
              <NextImage
                src={src}
                alt={alt}
                width={1920}
                height={1080}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
                unoptimized={!src.includes('unsplash.com')}
              />
            )}
          </div>

          {caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-bg-secondary border-3 border-border max-w-2xl">
              <p className="text-text-body text-sm text-center">{caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Side-by-side image comparison
export function ImageCompare({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
}: {
  before: string
  after: string
  beforeAlt: string
  afterAlt: string
  beforeLabel?: string
  afterLabel?: string
}) {
  const [isLoaded, setIsLoaded] = useState({ before: false, after: false })
  const isBeforeLocal = isLocalImage(before)
  const isAfterLocal = isLocalImage(after)

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Before */}
      <div>
        <div className="relative aspect-video border-3 border-border overflow-hidden">
          {isBeforeLocal ? (
            <NextImage
              src={before}
              alt={beforeAlt}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoaded.before ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(prev => ({ ...prev, before: true }))}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <NextImage
              src={before}
              alt={beforeAlt}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoaded.before ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(prev => ({ ...prev, before: true }))}
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={!before.includes('unsplash.com')}
            />
          )}
          <div className="absolute top-3 left-3 px-3 py-1 bg-bg-inverse border-2 border-border">
            <span className="text-text-inverse text-xs font-mono uppercase tracking-wider">{beforeLabel}</span>
          </div>
        </div>
      </div>

      {/* After */}
      <div>
        <div className="relative aspect-video border-3 border-border overflow-hidden">
          {isAfterLocal ? (
            <NextImage
              src={after}
              alt={afterAlt}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoaded.after ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(prev => ({ ...prev, after: true }))}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <NextImage
              src={after}
              alt={afterAlt}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoaded.after ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(prev => ({ ...prev, after: true }))}
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={!after.includes('unsplash.com')}
            />
          )}
          <div className="absolute top-3 left-3 px-3 py-1 bg-accent border-2 border-border">
            <span className="text-text-inverse text-xs font-mono uppercase tracking-wider">{afterLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

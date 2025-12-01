'use client'

interface VideoProps {
  src: string
  title?: string
  aspectRatio?: '16:9' | '4:3' | '1:1'
}

function getVideoEmbedUrl(src: string): string | null {
  // YouTube
  const youtubeMatch = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = src.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // Direct embed URL
  if (src.includes('embed') || src.includes('player')) {
    return src
  }

  return null
}

export function Video({ src, title = 'Video', aspectRatio = '16:9' }: VideoProps) {
  const embedUrl = getVideoEmbedUrl(src)

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  }

  if (!embedUrl) {
    return (
      <div className="my-6 border-3 border-border bg-bg-tertiary p-6 sm:p-8 text-center">
        <p className="text-text-muted text-sm sm:text-base">
          URL de vidéo non supportée. Formats acceptés : YouTube, Vimeo.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 brutal-btn text-sm"
        >
          Ouvrir la vidéo
        </a>
      </div>
    )
  }

  return (
    <figure className="my-6">
      <div className={`relative w-full ${aspectRatioClasses[aspectRatio]} border-3 border-border overflow-hidden bg-bg-inverse`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      {title && title !== 'Video' && (
        <figcaption className="mt-2 text-center text-sm text-text-muted">
          {title}
        </figcaption>
      )}
    </figure>
  )
}

export default Video

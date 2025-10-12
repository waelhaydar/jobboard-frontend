'use client'

import Image from 'next/image'
import { useState } from 'react'

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function NewsImage({ src, alt, className = '' }: NewsImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-2xl">📰</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      width={400}
      height={200}
      onError={() => setError(true)}
    />
  )
}
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FallbackImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = 'https://via.placeholder.com/800x400?text=Image+Not+Found',
  className,
  width,
  height,
  fill = false,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      onError={handleError}
    />
  );
}

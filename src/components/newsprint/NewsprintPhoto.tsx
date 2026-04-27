import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';

interface NewsprintPhotoProps {
  src: string;
  alt: string;
  height?: number;
  caption?: ReactNode;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fillWidth?: boolean;
}

export function NewsprintPhoto({
  src,
  alt,
  height = 280,
  caption,
  className = '',
  style,
  priority = false,
  fillWidth = true,
}: NewsprintPhotoProps) {
  return (
    <figure className={`newsprint-img-wrap ${className}`} style={{ height, ...style }}>
      <Image
        src={src}
        alt={alt}
        fill={fillWidth}
        sizes="(min-width: 1440px) 50vw, 100vw"
        priority={priority}
        className="newsprint-img"
        style={{ objectFit: 'cover' }}
      />
      {caption && (
        <figcaption
          className="caption"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--paper)',
            padding: '4px 8px',
            zIndex: 3,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

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
  /** When true, renders a magnifier control on the photo. Caller owns open state. */
  expandable?: boolean;
  onExpandClick?: () => void;
  expandLabel?: string;
  objectFit?: 'cover' | 'contain';
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
  expandable = false,
  onExpandClick,
  expandLabel = 'Ampliar fotografía',
  objectFit = 'cover',
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
        style={{ objectFit }}
      />
      {expandable && onExpandClick && (
        <button
          type="button"
          onClick={onExpandClick}
          aria-label={expandLabel}
          title={expandLabel}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 4,
            width: 34,
            height: 34,
            borderRadius: 0,
            border: '2px solid var(--paper)',
            background: 'rgba(15, 12, 8, 0.78)',
            color: 'var(--paper)',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontWeight: 900,
            fontSize: 16,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ⛶
        </button>
      )}
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

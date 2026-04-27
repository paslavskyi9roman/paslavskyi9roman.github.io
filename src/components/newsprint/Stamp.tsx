import type { CSSProperties, ReactNode } from 'react';

interface StampProps {
  children: ReactNode;
  color?: 'red' | 'blue';
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}

export function Stamp({ children, color = 'red', rotate = -8, className = '', style }: StampProps) {
  const cls = color === 'blue' ? 'stamp stamp-blue' : 'stamp';
  return (
    <span className={`${cls} ${className}`} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';

interface EsProps {
  es: ReactNode;
  en: string;
  className?: string;
}

/** Hover/focus a Spanish phrase to reveal its English translation. */
export function Es({ es, en, className = '' }: EsProps) {
  return (
    <span className={`es ${className}`} tabIndex={0}>
      {es}
      <span className="es-tooltip" role="tooltip">
        {en}
      </span>
    </span>
  );
}

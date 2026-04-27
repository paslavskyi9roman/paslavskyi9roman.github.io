'use client';

import { useEffect } from 'react';

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Madrid Noir] Route error:', error);
  }, [error]);

  return (
    <section className="space-y-6">
      <div className="panel p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-300">Error inesperado</p>
        <h1 className="mt-2 text-4xl font-bold">La investigación se ha detenido.</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Algo se ha torcido en la oficina del detective. Intenta de nuevo o vuelve al caso anterior.
        </p>
        {error.digest && <p className="mt-2 text-xs text-slate-500">Ref: {error.digest}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={reset} className="rounded-md bg-amber-400 px-4 py-2 font-medium text-noir-950">
            Reintentar
          </button>
        </div>
      </div>
    </section>
  );
}

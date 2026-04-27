import Link from 'next/link';
import { defaultLocale } from '@/i18n/config';

export default function LocaleNotFound() {
  return (
    <section className="space-y-6">
      <div className="panel p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">404 — Pista perdida</p>
        <h1 className="mt-2 text-4xl font-bold">Esta calle no existe en Madrid Noir.</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          The lead you followed leads nowhere. Volver al caso principal y continuar la investigación.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href={`/${defaultLocale}`} className="rounded-md bg-amber-400 px-4 py-2 font-medium text-noir-950">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

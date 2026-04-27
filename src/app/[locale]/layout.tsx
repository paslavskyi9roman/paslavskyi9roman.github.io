import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../globals.css';
import { type AppLocale, isAppLocale, locales } from '@/i18n/config';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const localizedMeta: Record<AppLocale, { title: string; description: string }> = {
  es: {
    title: 'Madrid Noir — RPG detectivesco para aprender español',
    description: 'Aprende español resolviendo casos en un RPG detectivesco ambientado en el Madrid de los años 50.',
  },
  en: {
    title: 'Madrid Noir — Spanish-learning detective RPG',
    description: 'Learn Spanish by solving cases in a noir detective RPG set in 1950s Madrid.',
  },
};

const labels: Record<AppLocale, { game: string; dashboard: string; login: string }> = {
  es: { game: 'Juego', dashboard: 'Panel', login: 'Iniciar sesión' },
  en: { game: 'Game', dashboard: 'Dashboard', login: 'Login' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: AppLocale = isAppLocale(locale) ? locale : 'es';
  const meta = localizedMeta[safeLocale];

  return {
    metadataBase: new URL(baseUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${safeLocale}`,
      languages: Object.fromEntries(locales.map((alt) => [alt, `/${alt}`])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: `${baseUrl}/${safeLocale}`,
      locale: safeLocale === 'es' ? 'es_ES' : 'en_US',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const t = labels[locale];

  return (
    <html lang={locale}>
      <body>
        <header className="border-b border-slate-800 bg-noir-900/80">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm">
            <Link href={`/${locale}`} className="font-semibold tracking-wide text-amber-300">
              Madrid Noir
            </Link>
            <div className="flex gap-4 text-slate-300">
              <Link href={`/${locale}/game`}>{t.game}</Link>
              <Link href={`/${locale}/dashboard`}>{t.dashboard}</Link>
              <Link href={`/${locale}/login`}>{t.login}</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

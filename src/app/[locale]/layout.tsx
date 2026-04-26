import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../globals.css';
import { AppLocale, isAppLocale } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Madrid Noir',
  description: 'Aprende español resolviendo casos en un RPG detectivesco.',
};

const labels: Record<AppLocale, { game: string; dashboard: string; login: string }> = {
  es: { game: 'Juego', dashboard: 'Panel', login: 'Iniciar sesión' },
  en: { game: 'Game', dashboard: 'Dashboard', login: 'Login' },
};

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

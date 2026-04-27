import type { Metadata } from 'next';
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

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Oswald:wght@500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Special+Elite&family=Caveat:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

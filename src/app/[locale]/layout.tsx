import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

export default async function LocaleLayout({
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

  return <>{children}</>;
}

import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const routes = ['', '/game', '/dashboard', '/login'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((alt) => [alt, `${baseUrl}/${alt}${route}`])),
      },
    })),
  );
}

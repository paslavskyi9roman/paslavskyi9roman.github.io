import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Madrid Noir',
  description: 'Learn Spanish by solving cases in a detective RPG.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-noir-900/80">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm">
            <Link href="/" className="font-semibold tracking-wide text-amber-300">
              Madrid Noir
            </Link>
            <div className="flex gap-4 text-slate-300">
              <Link href="/game">Game</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login">Login</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

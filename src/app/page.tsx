import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="panel p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Spanish Detective RPG</p>
        <h1 className="mt-2 text-4xl font-bold">Madrid Noir</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Learn Spanish by solving cases. Talk to suspects, find contradictions, and unlock clues through
          Spanish dialogue.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/game" className="rounded-md bg-amber-400 px-4 py-2 font-medium text-noir-950">
            Enter the Case
          </Link>
          <Link href="/dashboard" className="rounded-md border border-slate-600 px-4 py-2">
            View Progress
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LocaleLoading() {
  return (
    <section className="space-y-6">
      <div className="panel p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Cargando expediente…</p>
        <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-amber-400" />
        </div>
      </div>
    </section>
  );
}

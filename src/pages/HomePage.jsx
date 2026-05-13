import React from 'react'
import { Link } from 'react-router-dom'
import { IconHexMark, IconHistory, IconLock, IconProfile, StatusPill } from '../components/Icons.jsx'

function ActionCard({ iconSlot, title, description, buttonLabel, buttonClass, to }) {
  const ctaClass = `mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold tracking-tight shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] ${buttonClass}`

  return (
    <div className="group relative">
      <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-amber-200/25 via-violet-500/20 to-cyan-400/25 opacity-60 blur-xl transition duration-700 group-hover:opacity-100" />
      <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-amber-200/35 via-fuchsia-500/25 to-cyan-400/35 opacity-80 transition duration-500 group-hover:opacity-100" />
      <article className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-linear-to-br from-zinc-900/75 via-zinc-950/85 to-zinc-950/95 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_28px_72px_-28px_rgba(0,0,0,0.88)] backdrop-blur-2xl sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-white/8 to-white/2 ring-1 ring-inset ring-white/10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/15 to-cyan-500/10 text-cyan-200/90 ring-1 ring-white/10">
            {iconSlot}
          </div>
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">{title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{description}</p>
        {to ? (
          <Link to={to} className={ctaClass}>
            {buttonLabel}
          </Link>
        ) : (
          <button type="button" className={ctaClass}>
            {buttonLabel}
          </button>
        )}
      </article>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative w-full border-b border-white/8 bg-zinc-950/40 px-4 pt-6 pb-8 backdrop-blur-2xl sm:px-8 sm:pt-8 lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-200/15 to-transparent"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3 rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-amber-200/60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/3 shadow-[0_0_40px_-8px_rgba(168,85,247,0.45)]">
              <IconHexMark className="h-7 w-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Institutional</p>
              <p className="text-base font-semibold tracking-tight text-white sm:text-lg">Ledger Admin</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <StatusPill>Encrypted session</StatusPill>
            <StatusPill>Settlement · L2</StatusPill>
            <span className="font-mono text-[10px] text-zinc-600 sm:text-[11px]">UTC {new Date().toISOString().slice(11, 16)}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-12 xl:px-16">
      <section className="mb-12 text-center sm:mb-16">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-400/80 sm:text-xs">// control center</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-balance bg-linear-to-br from-white via-amber-100/95 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-5xl sm:leading-[1.1]">
          Treasury-grade operations, distilled into two actions.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-zinc-500 sm:text-base">
          Onboard identities and append immutable activity with the same rigor you expect from custody infrastructure.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-dashed border-white/6 py-4 font-mono text-[11px] text-zinc-600 sm:text-xs">
          <span className="text-zinc-500">
            TVL <span className="text-zinc-300">—</span>
          </span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span>
            Risk <span className="text-emerald-400/90">nominal</span>
          </span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span>
            Last sync <span className="text-zinc-400">just now</span>
          </span>
        </div>
      </section>

      <main className="grid flex-1 gap-8 sm:grid-cols-2 sm:gap-10">
        <ActionCard
          to="/create-profile"
          iconSlot={<IconProfile className="h-6 w-6" />}
          title="Create profile"
          description="Provision a compliant profile with KYC-ready fields, limits, and signing authority mapped to your policy engine."
          buttonLabel="Create profile"
          buttonClass="border border-amber-400/25 bg-linear-to-r from-amber-200 via-amber-100 to-amber-50 text-zinc-950 shadow-[0_0_48px_-12px_rgba(251,191,36,0.55)] hover:from-amber-100 hover:to-white focus-visible:outline-amber-200/80"
        />
        <ActionCard
          to="/create-history"
          iconSlot={<IconHistory className="h-6 w-6" />}
          title="Create transaction history"
          description="Post ledger movements with traceable hashes, counterparties, and audit metadata aligned to your reconciliation pipeline."
          buttonLabel="Create transaction history"
          buttonClass="border border-cyan-400/30 bg-linear-to-r from-cyan-400 via-teal-300 to-emerald-300 text-zinc-950 shadow-[0_0_48px_-12px_rgba(34,211,238,0.45)] hover:from-cyan-300 hover:to-emerald-200 focus-visible:outline-cyan-300/80"
        />
      </main>
      </div>

      <footer className="mt-auto w-full border-t border-white/6 bg-zinc-950/30 px-4 py-8 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <IconLock className="h-3.5 w-3.5 text-zinc-600" />
          <p className="font-mono text-[11px] text-zinc-600">
            Signed-in administrators · keys never leave your secure enclave
          </p>
        </div>
      </footer>
    </div>
  )
}

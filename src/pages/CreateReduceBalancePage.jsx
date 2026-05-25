/**
 * CREATE REDUCE BALANCE PAGE
 * --------------------------
 * Form: username + amount → POST via createReduceBalance() in src/api/createReduceBalance.js
 *
 * Same flow as add balance, but debits the profile (see API contract in that file).
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createReduceBalance } from '../api/createReduceBalance.js'
import { fieldInputClass, FormField } from '../components/FormField.jsx'
import { IconArrowLeft, IconHexMark, IconLock, StatusPill } from '../components/Icons.jsx'

const initialForm = {
  username: '',
  reduceBalanceAmount: '',
}

export default function CreateReduceBalancePage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const username = form.username.trim()
    if (!username) {
      setError('Username is required.')
      return
    }

    const amount = Number.parseFloat(form.reduceBalanceAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Reduce balance amount must be greater than zero.')
      return
    }

    // --- API call: see src/api/createReduceBalance.js for URL and JSON shape ---
    const payload = {
      username,
      reduceBalanceAmount: amount,
    }

    setSubmitting(true)
    try {
      await createReduceBalance(payload)
      setSuccess(true)
      setForm(initialForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reduce balance right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative w-full border-b border-white/8 bg-zinc-950/45 px-4 pt-6 pb-8 backdrop-blur-2xl sm:px-8 sm:pb-10 lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-rose-200/20 to-transparent"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-zinc-300 shadow-sm shadow-black/30 outline-offset-4 transition hover:border-amber-400/25 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-200/60"
            >
              <IconArrowLeft className="h-4 w-4 text-zinc-400" />
              Control center
            </Link>
            <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-white/10 to-white/2 shadow-[0_0_32px_-8px_rgba(251,113,133,0.5)] ring-1 ring-inset ring-white/10">
                <IconHexMark className="h-7 w-7" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">Balance debit</p>
                <h1 className="mt-0.5 bg-linear-to-r from-white to-zinc-300 bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl">
                  Create reduce balance
                </h1>
              </div>
            </div>
          </div>
          <StatusPill>Reduce balance</StatusPill>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {success ? (
          <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/15 to-emerald-950/40 px-5 py-6 text-sm text-emerald-50 shadow-[0_0_48px_-20px_rgba(52,211,153,0.5)]">
            <p className="text-base font-semibold tracking-tight">Balance reduced successfully.</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-100/75">
              The debit has been applied. You can make another balance adjustment.
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="relative mt-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-linear-to-br from-rose-200/35 via-orange-500/25 to-amber-400/35 opacity-90 blur-xl sm:-inset-1"
          />
          <div className="relative rounded-[1.25rem] border border-white/10 bg-linear-to-br from-zinc-900/95 via-zinc-950/98 to-[#050506] p-6 shadow-[0_32px_80px_-40px_rgba(251,113,133,0.35),0_0_0_1px_rgba(255,255,255,0.05)_inset] backdrop-blur-xl sm:rounded-3xl sm:p-8">
            <div className="mb-8 border-b border-white/10 pb-6">
              <h2 className="bg-linear-to-r from-white via-rose-50/95 to-amber-100/90 bg-clip-text text-lg font-semibold tracking-tight text-transparent sm:text-xl">
                Reduce balance details
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Debit the selected profile by username and amount.
              </p>
            </div>

            {error ? (
              <div
                className="mb-6 rounded-xl border border-red-400/40 bg-linear-to-r from-red-500/15 to-red-950/30 px-4 py-3 text-sm text-red-100 shadow-[0_0_24px_-8px_rgba(248,113,113,0.35)]"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <div className="space-y-5">
              <FormField id="username" label="Username">
                <input
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => update('username', e.target.value)}
                  className={fieldInputClass}
                  placeholder="user_handle"
                />
              </FormField>

              <FormField id="reduceBalanceAmount" label="Reduce balance amount" hint="Amount to debit from the profile.">
                <input
                  id="reduceBalanceAmount"
                  name="reduceBalanceAmount"
                  type="number"
                  inputMode="decimal"
                  min={0.01}
                  step="0.01"
                  required
                  value={form.reduceBalanceAmount}
                  onChange={(e) => update('reduceBalanceAmount', e.target.value)}
                  className={`${fieldInputClass} font-mono tabular-nums`}
                  placeholder="0.00"
                />
              </FormField>
            </div>

            <div className="mt-10 flex justify-end border-t border-white/8 pt-8">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl border border-rose-400/35 bg-linear-to-r from-rose-400 via-orange-300 to-amber-300 px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_52px_-10px_rgba(251,113,133,0.55)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300/80 disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900/30 border-t-zinc-900" />
                    Saving…
                  </>
                ) : (
                  'Reduce balance'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <footer className="mt-auto w-full border-t border-white/6 bg-zinc-950/30 px-4 py-8 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <IconLock className="h-3.5 w-3.5 text-zinc-600" />
          <p className="font-mono text-[11px] text-zinc-500">Balance debits · audited ledger adjustments</p>
        </div>
      </footer>
    </div>
  )
}

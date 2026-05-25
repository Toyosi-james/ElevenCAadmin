/**
 * CREATE PROFILE PAGE (multi-step wizard)
 * ---------------------------------------
 * Final step submits via createProfile() → POST /api/profiles
 * See src/api/createProfile.js for the exact JSON field names your backend should accept.
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createProfile } from '../api/createProfile.js'
import { fieldInputClass, FormField } from '../components/FormField.jsx'
import { IconArrowLeft, IconHexMark, IconLock, StatusPill } from '../components/Icons.jsx'

/** Wizard steps shown in the stepper UI (order matters). */
const STEPS = [
  {
    id: 'account',
    title: 'Account',
    description: 'Identity, email, password, and asset PIN — one checkpoint.',
  },
  { id: 'profile', title: 'Profile', description: 'Gender, age, and country' },
  { id: 'address', title: 'Address', description: 'Residential address' },
  { id: 'ledger', title: 'Balance', description: 'Opening ledger amount' },
]

const initialForm = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  assetPin: '',
  gender: '',
  age: '',
  country: '',
  residentialAddress: '',
  mainBalanceAmount: '',
}

/** Progress indicator at the top of the profile form. */
function Stepper({ current, steps }) {
  const total = steps.length
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider sm:mb-4 sm:text-[11px]">
        <span className="bg-linear-to-r from-cyan-400/90 to-amber-200/90 bg-clip-text text-transparent">
          Step {current + 1} of {total}
        </span>
        <span className="text-zinc-500">{Math.round(((current + 1) / total) * 100)}% complete</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        {steps.map((s, i) => {
          const done = i < current
          const active = i === current
          return (
            <React.Fragment key={s.id}>
              {i > 0 ? (
                <div
                  className={`h-0.5 min-w-2 flex-1 rounded-full sm:min-w-4 ${
                    done
                      ? 'bg-linear-to-r from-amber-400/70 via-fuchsia-500/60 to-cyan-400/70 opacity-90 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                      : 'bg-zinc-800'
                  }`}
                  aria-hidden
                />
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition sm:h-9 sm:w-9 ${
                    done
                      ? 'bg-linear-to-br from-emerald-500/25 to-cyan-500/20 text-emerald-100 ring-1 ring-emerald-400/40 shadow-[0_0_16px_rgba(52,211,153,0.25)]'
                      : active
                        ? 'bg-linear-to-br from-amber-200 via-fuchsia-400 to-cyan-400 text-zinc-950 shadow-[0_0_28px_-4px_rgba(168,85,247,0.65),0_0_24px_-8px_rgba(34,211,238,0.35)] ring-2 ring-white/25'
                        : 'bg-zinc-900/90 text-zinc-600 ring-1 ring-zinc-700'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span
                  className={`hidden w-full truncate text-center text-[10px] font-medium sm:block ${
                    active ? 'bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent' : 'text-zinc-600'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default function CreateProfilePage() {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const lastIndex = STEPS.length - 1

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(false)
  }

  function focusField(fieldId) {
    if (!fieldId) return
    const el = document.getElementById(fieldId)
    if (!el) return
    // Ensure the invalid field is visible before moving keyboard focus.
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // Let scroll settle before focus to avoid jumpy UI.
    window.setTimeout(() => el.focus(), 120)
  }

  /** Client-side checks before moving to the next step or submitting. */
  function validateStep(index) {
    const u = form.username.trim()
    const userOk = /^[a-zA-Z0-9._-]+$/.test(u) && u.length >= 3

    switch (index) {
      case 0:
        if (!form.firstName.trim()) return { message: 'Please enter first name.', fieldId: 'firstName' }
        if (!form.lastName.trim()) return { message: 'Please enter last name.', fieldId: 'lastName' }
        if (!userOk)
          return {
            message: 'Username: 3+ characters; letters, numbers, dot, underscore, or hyphen only.',
            fieldId: 'username',
          }
        if (!form.email.trim()) return { message: 'Please enter your email.', fieldId: 'email' }
        if (form.password.length < 8) return { message: 'Password must be at least 8 characters.', fieldId: 'password' }
        if (!/^\d{4}(\d{2})?$/.test(form.assetPin)) {
          return { message: 'Asset PIN must be exactly 4 or 6 digits.', fieldId: 'assetPin' }
        }
        return null
      case 1: {
        if (!form.gender) return { message: 'Please select gender.', fieldId: 'gender' }
        const ageNum = Number.parseInt(form.age, 10)
        if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 120) {
          return { message: 'Age must be a whole number between 18 and 120.', fieldId: 'age' }
        }
        if (!form.country.trim()) return { message: 'Please enter country.', fieldId: 'country' }
        return null
      }
      case 2:
        if (!form.residentialAddress.trim()) {
          return { message: 'Please enter your residential address.', fieldId: 'residentialAddress' }
        }
        return null
      case 3: {
        const n = Number.parseFloat(form.mainBalanceAmount)
        if (!Number.isFinite(n) || n < 0) {
          return { message: 'Enter a valid non-negative balance.', fieldId: 'mainBalanceAmount' }
        }
        return null
      }
      default:
        return null
    }
  }

  function goNext() {
    const issue = validateStep(step)
    if (issue) {
      setError(issue.message)
      focusField(issue.fieldId)
      return
    }
    setError(null)
    setStep((s) => Math.min(s + 1, lastIndex))
  }

  function goBack() {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const stepErr = validateStep(lastIndex)
    if (stepErr) {
      setError(stepErr.message)
      focusField(stepErr.fieldId)
      return
    }

    const ageNum = Number.parseInt(form.age, 10)
    const balanceNum = Number.parseFloat(form.mainBalanceAmount)

    if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 120) {
      setError('Age must be a whole number between 18 and 120.')
      return
    }
    if (!Number.isFinite(balanceNum) || balanceNum < 0) {
      setError('Main balance must be a non-negative number.')
      return
    }

    // --- API call: src/api/createProfile.js ---
    const payload = {
      // Field names must match your backend request body / DTO.
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      assetPin: form.assetPin,
      gender: form.gender,
      age: ageNum,
      country: form.country.trim(),
      residentialAddress: form.residentialAddress.trim(),
      mainBalanceAmount: balanceNum,
    }

    setSubmitting(true)
    try {
      await createProfile(payload) // POST /api/profiles
      setSuccess(true)
      setForm(initialForm)
      setStep(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create profile.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepMeta = STEPS[step]

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="relative w-full border-b border-white/8 bg-zinc-950/45 px-4 pt-6 pb-8 backdrop-blur-2xl sm:px-8 sm:pb-10 lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-200/20 to-transparent"
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-white/10 to-white/2 shadow-[0_0_32px_-8px_rgba(168,85,247,0.5)] ring-1 ring-inset ring-white/10">
                <IconHexMark className="h-7 w-7" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">Custody onboarding</p>
                <h1 className="mt-0.5 bg-linear-to-r from-white to-zinc-300 bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl">
                  Create profile
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <StatusPill>KYC</StatusPill>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-16 pt-10 sm:max-w-2xl sm:px-6 lg:px-8">
        {success ? (
          <div className="mx-auto w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/15 to-emerald-950/40 px-5 py-6 text-sm text-emerald-50 shadow-[0_0_48px_-20px_rgba(52,211,153,0.5)]">
            <p className="text-base font-semibold tracking-tight">Profile submitted successfully.</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-100/75">
              Your backend accepted the request. You can start another profile or return to the hub.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                Back to hub
              </Link>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="inline-flex rounded-xl border border-emerald-400/35 bg-emerald-500/25 px-5 py-2.5 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-500/35"
              >
                Create another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex w-full flex-col">
            <Stepper current={step} steps={STEPS} />

            <div className="relative mt-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-linear-to-br from-amber-200/35 via-fuchsia-500/35 to-cyan-400/35 opacity-90 blur-xl sm:-inset-1"
              />
              <div className="relative rounded-[1.25rem] border border-white/10 bg-linear-to-br from-zinc-900/95 via-zinc-950/98 to-[#050506] p-6 shadow-[0_32px_80px_-40px_rgba(168,85,247,0.45),0_0_0_1px_rgba(255,255,255,0.05)_inset] backdrop-blur-xl sm:rounded-3xl sm:p-8">
              <div className="mb-8 border-b border-white/10 pb-6">
                <h2 className="bg-linear-to-r from-white via-amber-50/95 to-cyan-100/90 bg-clip-text text-lg font-semibold tracking-tight text-transparent sm:text-xl">
                  {stepMeta.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{stepMeta.description}</p>
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
                {step === 0 && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField id="firstName" label="First name">
                        <input
                          id="firstName"
                          name="firstName"
                          autoComplete="given-name"
                          required
                          maxLength={80}
                          value={form.firstName}
                          onChange={(e) => update('firstName', e.target.value)}
                          className={fieldInputClass}
                          placeholder="Ada"
                        />
                      </FormField>
                      <FormField id="lastName" label="Last name">
                        <input
                          id="lastName"
                          name="lastName"
                          autoComplete="family-name"
                          required
                          maxLength={80}
                          value={form.lastName}
                          onChange={(e) => update('lastName', e.target.value)}
                          className={fieldInputClass}
                          placeholder="Lovelace"
                        />
                      </FormField>
                    </div>
                    <FormField id="username" label="Username">
                      <input
                        id="username"
                        name="username"
                        autoComplete="username"
                        required
                        minLength={3}
                        maxLength={32}
                        pattern="[a-zA-Z0-9._-]+"
                        title="Letters, numbers, dot, underscore, or hyphen"
                        value={form.username}
                        onChange={(e) => update('username', e.target.value)}
                        className={fieldInputClass}
                        placeholder="ada_lovelace"
                      />
                    </FormField>
                    <FormField id="email" label="Email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={fieldInputClass}
                        placeholder="ada@institution.io"
                      />
                    </FormField>

                    <div className="relative py-2">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" aria-hidden />
                      <p className="relative mx-auto w-fit bg-zinc-950 px-3 font-mono text-[10px] uppercase tracking-[0.35em] text-fuchsia-300/90">
                        Credentials
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField id="password" label="Password" hint="Stored hashed on the server only.">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          minLength={8}
                          maxLength={128}
                          value={form.password}
                          onChange={(e) => update('password', e.target.value)}
                          className={fieldInputClass}
                          placeholder="••••••••"
                        />
                      </FormField>
                      <FormField id="assetPin" label="Asset PIN" hint="Separate secret for asset actions (4 or 6 digits).">
                        <input
                          id="assetPin"
                          name="assetPin"
                          type="password"
                          autoComplete="off"
                          required
                          minLength={4}
                          maxLength={6}
                          inputMode="numeric"
                          pattern="^\\d{4}(\\d{2})?$"
                          title="Asset PIN must be 4 or 6 digits"
                          value={form.assetPin}
                          onChange={(e) => update('assetPin', e.target.value)}
                          className={fieldInputClass}
                          placeholder="••••••••"
                        />
                      </FormField>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <FormField id="gender" label="Gender">
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={form.gender}
                        onChange={(e) => update('gender', e.target.value)}
                        className={`${fieldInputClass} crypto-select cursor-pointer bg-zinc-950 text-zinc-100`}
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </FormField>
                    <FormField id="age" label="Age">
                      <input
                        id="age"
                        name="age"
                        type="number"
                        inputMode="numeric"
                        required
                        min={18}
                        max={120}
                        value={form.age}
                        onChange={(e) => update('age', e.target.value)}
                        className={`${fieldInputClass} font-mono tabular-nums`}
                        placeholder="21"
                      />
                    </FormField>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <FormField id="country" label="Country">
                        <input
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          required
                          maxLength={80}
                          value={form.country}
                          onChange={(e) => update('country', e.target.value)}
                          className={fieldInputClass}
                          placeholder="United States"
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <FormField id="residentialAddress" label="Residential address">
                    <textarea
                      id="residentialAddress"
                      name="residentialAddress"
                      autoComplete="street-address"
                      required
                      rows={5}
                      maxLength={500}
                      value={form.residentialAddress}
                      onChange={(e) => update('residentialAddress', e.target.value)}
                      className={`${fieldInputClass} resize-y py-3.5 leading-relaxed`}
                      placeholder="Street, unit, city, region, postal code"
                    />
                  </FormField>
                )}

                {step === 3 && (
                  <FormField
                    id="mainBalanceAmount"
                    label="Main balance amount"
                    hint="Opening balance in your reporting currency."
                  >
                    <div className="flex w-full items-stretch overflow-hidden rounded-[inherit]">
                      <span className="flex shrink-0 items-center border-r border-white/10 bg-white/3 px-3 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                        Fiat
                      </span>
                      <input
                        id="mainBalanceAmount"
                        name="mainBalanceAmount"
                        type="number"
                        inputMode="decimal"
                        required
                        min={0}
                        step="0.01"
                        value={form.mainBalanceAmount}
                        onChange={(e) => update('mainBalanceAmount', e.target.value)}
                        className={`${fieldInputClass} font-mono tabular-nums`}
                        placeholder="0.00"
                      />
                    </div>
                  </FormField>
                )}
              </div>

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-35"
                >
                  Back
                </button>
                <div className="flex gap-3 sm:ml-auto">
                  {step < lastIndex ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex min-w-32 flex-1 items-center justify-center rounded-xl border border-cyan-400/30 bg-linear-to-r from-amber-200 via-fuchsia-200/95 to-cyan-300 px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_48px_-10px_rgba(168,85,247,0.55),0_0_32px_-8px_rgba(34,211,238,0.35)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70 sm:flex-none"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-w-40 flex-1 items-center justify-center gap-2 rounded-xl border border-amber-300/35 bg-linear-to-r from-amber-200 via-fuchsia-200/90 to-cyan-300 px-8 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_52px_-10px_rgba(251,191,36,0.55),0_0_36px_-8px_rgba(168,85,247,0.45)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200/80 disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900/30 border-t-zinc-900" />
                          Submitting…
                        </>
                      ) : (
                        'Create profile'
                      )}
                    </button>
                  )}
                </div>
              </div>
              </div>
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-center font-mono text-[11px] text-zinc-600">
              <IconLock className="h-3.5 w-3.5 shrink-0 text-cyan-500/60" />
              <span className="bg-linear-to-r from-zinc-500 to-cyan-600/70 bg-clip-text text-transparent">
                TLS · credentials hashed server-side
              </span>
            </p>
          </form>
        )}
      </div>

      <footer className="mt-auto w-full border-t border-white/6 bg-zinc-950/30 px-4 py-8 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <IconLock className="h-3.5 w-3.5 text-zinc-600" />
          <p className="font-mono text-[11px] text-zinc-500">Institutional custody · audit-grade submissions</p>
        </div>
      </footer>
    </div>
  )
}

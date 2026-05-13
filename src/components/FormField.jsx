import React from 'react'

const labelCls =
  'block font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500'

/**
 * @param {{ id: string, label: string, hint?: string, children: React.ReactNode }} props
 */
export function FormField({ id, label, hint, children }) {
  return (
    <div className="group/field">
      <label className={labelCls} htmlFor={id}>
        {label}
      </label>
      <div className="crypto-field-shell mt-2">
        <div className="crypto-field-inner">{children}</div>
      </div>
      {hint ? <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">{hint}</p> : null}
    </div>
  )
}

const inputInner =
  'w-full border-0 bg-transparent px-3.5 py-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 disabled:opacity-50'

export const fieldInputClass = `${inputInner} rounded-[inherit]`

/**
 * POST reduce-balance to your API.
 * Set `VITE_API_BASE_URL` (no trailing slash) in `.env`.
 * Falls back to same-origin `/api/reduce-balance` when unset.
 */

function reduceBalanceEndpoint() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return base ? `${base}/api/reduce-balance` : '/api/reduce-balance'
}

/**
 * @typedef {Object} CreateReduceBalancePayload
 * @property {string} username
 * @property {number} reduceBalanceAmount
 */

/**
 * @param {CreateReduceBalancePayload} payload
 * @returns {Promise<unknown>}
 */
export async function createReduceBalance(payload) {
  const res = await fetch(reduceBalanceEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const raw = await res.text()
  let data = null
  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = raw
    }
  }

  if (!res.ok) {
    const message =
      (typeof data === 'object' && data !== null && (data.message ?? data.error)) ||
      (typeof data === 'string' ? data : null) ||
      `Request failed (${res.status})`
    throw new Error(String(message))
  }

  return data ?? { ok: true }
}

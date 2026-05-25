/**
 * POST add-balance to your API.
 * Set `VITE_API_BASE_URL` (no trailing slash) in `.env`.
 * Falls back to same-origin `/api/add-balance` when unset.
 */

function addBalanceEndpoint() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return base ? `${base}/api/add-balance` : '/api/add-balance'
}

/**
 * @typedef {Object} CreateAddBalancePayload
 * @property {string} username
 * @property {number} addBalanceAmount
 */

/**
 * @param {CreateAddBalancePayload} payload
 * @returns {Promise<unknown>}
 */
export async function createAddBalance(payload) {
  const res = await fetch(addBalanceEndpoint(), {
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

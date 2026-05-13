/**
 * POST transaction history to your API.
 * Set `VITE_API_BASE_URL` (no trailing slash) in `.env`.
 * Falls back to same-origin `/api/transaction-history` when unset.
 */

function transactionHistoryEndpoint() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return base ? `${base}/api/transaction-history` : '/api/transaction-history'
}

/**
 * @typedef {Object} CreateTransactionHistoryPayload
 * @property {string} username
 * @property {string} transaction
 * @property {string} transactionDetails
 * @property {number} transactionAmount
 * @property {"completed"|"pending"|"rejected"} transactionStatus
 * @property {string} transactionDate
 * @property {string} transactionTime
 * @property {string} transactionDateTime
 */

/**
 * @param {CreateTransactionHistoryPayload} payload
 * @returns {Promise<unknown>}
 */
export async function createTransactionHistory(payload) {
  const res = await fetch(transactionHistoryEndpoint(), {
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

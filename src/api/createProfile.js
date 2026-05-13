/**
 * POST JSON body to your API. Set `VITE_API_BASE_URL` (no trailing slash) in `.env`
 * so requests go to e.g. `https://api.yourbank.com/api/profiles`.
 * If unset, posts to same-origin `/api/profiles` (typical Vite proxy target).
 *
 * Never log or persist `password` or `assetPin` on the client beyond this request.
 */

function profileEndpoint() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return base ? `${base}/api/profiles` : '/api/profiles'
}

/**
 * @typedef {Object} CreateProfilePayload
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} assetPin
 * @property {string} gender
 * @property {number} age
 * @property {string} country
 * @property {string} residentialAddress
 * @property {number} mainBalanceAmount
 */

/**
 * @param {CreateProfilePayload} payload
 * @returns {Promise<unknown>}
 */
export async function createProfile(payload) {
  const res = await fetch(profileEndpoint(), {
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

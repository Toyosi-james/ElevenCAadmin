/**
 * Shared HTTP helpers for every admin → backend request.
 *
 * Flow:
 *   1. A page collects form data and calls a function in src/api/*.js
 *   2. That function calls postJson() with a path from endpoints.js
 *   3. postJson() builds the full URL, attaches JSON headers (and optional auth)
 *   4. The backend responds with JSON; errors surface as thrown Error messages
 *
 * Configure via .env in the project root:
 *   VITE_API_BASE_URL  — e.g. https://api.yourbank.com (no trailing slash)
 *   VITE_API_TOKEN     — optional Bearer token for protected routes
 */

/**
 * Turn a path like "/api/add-balance" into a full URL.
 *
 * @param {string} path — must start with "/" (see API_PATHS in endpoints.js)
 * @returns {string}
 */
export function resolveApiUrl(path) {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  return base ? `${base}${path}` : path
}

/**
 * Headers sent on every POST. Add Authorization when VITE_API_TOKEN is set.
 *
 * @returns {Record<string, string>}
 */
export function buildJsonHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const token = import.meta.env.VITE_API_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

/**
 * Read response body as text, then try JSON.parse.
 * Backends may return plain text errors — we handle both.
 *
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function parseResponseBody(res) {
  const raw = await res.text()
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

/**
 * Pull a human-readable message from a failed API response.
 *
 * @param {unknown} data
 * @param {number} status — HTTP status code
 * @returns {string}
 */
function errorMessageFromBody(data, status) {
  if (typeof data === 'object' && data !== null) {
    const msg = data.message ?? data.error
    if (msg) return String(msg)
  }
  if (typeof data === 'string' && data.trim()) return data
  return `Request failed (${status})`
}

/**
 * POST JSON to the backend. Used by all modules in src/api/.
 *
 * @param {string} path — route from API_PATHS (e.g. "/api/add-balance")
 * @param {Record<string, unknown>} body — serialised as JSON request body
 * @returns {Promise<unknown>} — parsed JSON body, or { ok: true } if empty 2xx
 * @throws {Error} — when HTTP status is not ok; message comes from backend when possible
 */
export async function postJson(path, body) {
  const url = resolveApiUrl(path)

  const res = await fetch(url, {
    method: 'POST',
    headers: buildJsonHeaders(),
    body: JSON.stringify(body),
  })

  const data = await parseResponseBody(res)

  if (!res.ok) {
    throw new Error(errorMessageFromBody(data, res.status))
  }

  return data ?? { ok: true }
}

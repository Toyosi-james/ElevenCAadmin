/**
 * CREATE ADD BALANCE — API module
 * =================================
 * Used by: src/pages/CreateAddBalancePage.jsx
 *
 * Backend contract (implement on your server):
 *   Method:  POST
 *   Path:    /api/add-balance
 *   Body:    { "username": string, "addBalanceAmount": number }
 *
 * Success: HTTP 2xx, optional JSON body (e.g. { "ok": true, "newBalance": 1500 })
 * Error:   HTTP 4xx/5xx with JSON { "message": "..." } or { "error": "..." }
 */

import { API_PATHS } from './endpoints.js'
import { postJson } from './httpClient.js'

/**
 * @typedef {Object} CreateAddBalancePayload
 * @property {string} username — profile to credit (trimmed on the page before send)
 * @property {number} addBalanceAmount — positive number; page validates > 0
 */

/**
 * Credit balance for an existing user.
 *
 * @param {CreateAddBalancePayload} payload
 * @returns {Promise<unknown>} — backend JSON on success
 */
export async function createAddBalance(payload) {
  return postJson(API_PATHS.addBalance, payload)
}

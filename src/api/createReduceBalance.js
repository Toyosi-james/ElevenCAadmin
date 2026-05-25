/**
 * CREATE REDUCE BALANCE — API module
 * ====================================
 * Used by: src/pages/CreateReduceBalancePage.jsx
 *
 * Backend contract (implement on your server):
 *   Method:  POST
 *   Path:    /api/reduce-balance
 *   Body:    { "username": string, "reduceBalanceAmount": number }
 *
 * Success: HTTP 2xx, optional JSON body (e.g. { "ok": true, "newBalance": 900 })
 * Error:   HTTP 4xx/5xx with JSON { "message": "..." } or { "error": "..." }
 */

import { API_PATHS } from './endpoints.js'
import { postJson } from './httpClient.js'

/**
 * @typedef {Object} CreateReduceBalancePayload
 * @property {string} username — profile to debit (trimmed on the page before send)
 * @property {number} reduceBalanceAmount — positive number; page validates > 0
 */

/**
 * Debit balance for an existing user.
 *
 * @param {CreateReduceBalancePayload} payload
 * @returns {Promise<unknown>} — backend JSON on success
 */
export async function createReduceBalance(payload) {
  return postJson(API_PATHS.reduceBalance, payload)
}

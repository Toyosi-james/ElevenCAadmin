/**
 * CREATE TRANSACTION HISTORY — API module
 * ========================================
 * Used by: src/pages/CreateHistoryPage.jsx
 *
 * Backend contract:
 *   Method:  POST
 *   Path:    /api/transaction-history
 *   Body:    see CreateTransactionHistoryPayload below
 */

import { API_PATHS } from './endpoints.js'
import { postJson } from './httpClient.js'

/**
 * @typedef {Object} CreateTransactionHistoryPayload
 * @property {string} username
 * @property {string} transaction — short label (e.g. "Deposit")
 * @property {string} transactionDetails — longer description
 * @property {number} transactionAmount — positive amount
 * @property {"completed"|"pending"|"rejected"} transactionStatus
 * @property {string} transactionDate — YYYY-MM-DD
 * @property {string} transactionTime — HH:mm
 * @property {string} transactionDateTime — combined ISO-style string from page
 */

/**
 * @param {CreateTransactionHistoryPayload} payload
 * @returns {Promise<unknown>}
 */
export async function createTransactionHistory(payload) {
  return postJson(API_PATHS.transactionHistory, payload)
}

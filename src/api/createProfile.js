/**
 * CREATE PROFILE — API module
 * ==============================
 * Used by: src/pages/CreateProfilePage.jsx
 *
 * Backend contract:
 *   Method:  POST
 *   Path:    /api/profiles
 *   Body:    see CreateProfilePayload below
 *
 * Security: password and assetPin are sent once in this request.
 *           Never log them on the client or store them in localStorage.
 */

import { API_PATHS } from './endpoints.js'
import { postJson } from './httpClient.js'

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
 * @property {number} mainBalanceAmount — opening balance (>= 0)
 */

/**
 * @param {CreateProfilePayload} payload
 * @returns {Promise<unknown>}
 */
export async function createProfile(payload) {
  return postJson(API_PATHS.profiles, payload)
}

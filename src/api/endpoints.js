/**
 * Central list of backend route paths used by this admin panel.
 *
 * When VITE_API_BASE_URL is set in .env, requests become:
 *   {VITE_API_BASE_URL}/api/add-balance
 *
 * When VITE_API_BASE_URL is empty, the browser calls same-origin paths like:
 *   /api/add-balance
 * which Vite can forward to your server in development (see vite.config.js).
 */
export const API_PATHS = {
  /** POST — create a new user profile (Create profile page). */
  profiles: '/api/profiles',

  /** POST — append a transaction history row (Create transaction history page). */
  transactionHistory: '/api/transaction-history',

  /** POST — credit balance for an existing username (Create add balance page). */
  addBalance: '/api/add-balance',

  /** POST — debit balance for an existing username (Create reduce balance page). */
  reduceBalance: '/api/reduce-balance',
}

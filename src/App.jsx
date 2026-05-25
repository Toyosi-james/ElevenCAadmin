/**
 * Root layout: background, router, and one route per admin action.
 * Pages that call the backend live under src/pages/ and import from src/api/.
 */
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CryptoBackdrop } from './components/CryptoBackdrop.jsx'
import CreateAddBalancePage from './pages/CreateAddBalancePage.jsx'
import CreateHistoryPage from './pages/CreateHistoryPage.jsx'
import CreateProfilePage from './pages/CreateProfilePage.jsx'
import CreateReduceBalancePage from './pages/CreateReduceBalancePage.jsx'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans min-h-dvh overflow-x-hidden bg-[#020203] text-zinc-200 antialiased">
        <CryptoBackdrop />
        <div className="relative flex min-h-dvh w-full flex-col">
          <Routes>
            {/* Hub — links to each form; no API calls on this page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} /> {/* → POST /api/profiles */}
            <Route path="/create-history" element={<CreateHistoryPage />} /> {/* → POST /api/transaction-history */}
            {/* Balance adjustments → POST /api/add-balance and /api/reduce-balance */}
            <Route path="/create-add-balance" element={<CreateAddBalancePage />} />
            <Route path="/create-reduce-balance" element={<CreateReduceBalancePage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

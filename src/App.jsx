import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CryptoBackdrop } from './components/CryptoBackdrop.jsx'
import CreateHistoryPage from './pages/CreateHistoryPage.jsx'
import CreateProfilePage from './pages/CreateProfilePage.jsx'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans min-h-dvh overflow-x-hidden bg-[#020203] text-zinc-200 antialiased">
        <CryptoBackdrop />
        <div className="relative flex min-h-dvh w-full flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-profile" element={<CreateProfilePage />} />
            <Route path="/create-history" element={<CreateHistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

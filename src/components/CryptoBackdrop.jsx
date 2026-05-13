export function CryptoBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(168,85,247,0.18),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(34,211,238,0.12),transparent_50%),radial-gradient(ellipse_60%_45%_at_0%_100%,rgba(251,191,36,0.08),transparent_55%)]"
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-crypto-grid opacity-90" />
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-crypto-stripes mix-blend-soft-light opacity-70" />
      <div aria-hidden className="pointer-events-none fixed inset-0 noise-overlay" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),transparent_50%)]"
      />
    </>
  )
}

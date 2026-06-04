'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ja">
      <body style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>問題が発生しました</h2>
        <p style={{ color: '#666' }}>{error.message ?? '予期しないエラーが発生しました'}</p>
        <button
          onClick={() => reset()}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          再試行
        </button>
      </body>
    </html>
  )
}

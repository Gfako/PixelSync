export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--background)'}}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground mx-auto mb-4" style={{borderColor: 'var(--foreground)'}}></div>
        <div className="text-xl brutalist-text">LOADING...</div>
      </div>
    </div>
  )
}
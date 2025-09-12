import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--background)'}}>
      <div className="max-w-md w-full text-center">
        <div className="brutalist-card">
          <div className="mb-6">
            <div className="w-16 h-16 brutalist-card flex items-center justify-center mx-auto mb-4" style={{background: 'var(--accent)', color: 'var(--background)'}}>
              <Search className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold brutalist-text mb-2">
              PAGE NOT FOUND
            </h1>
            <p className="brutalist-text opacity-80">
              THE PAGE YOU'RE LOOKING FOR DOESN'T EXIST OR HAS BEEN MOVED.
            </p>
          </div>
          
          <Link 
            href="/"
            className="w-full brutalist-button flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
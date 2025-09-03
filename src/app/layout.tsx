import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PixelSync - Meeting Scheduler',
  description: 'Retro-style meeting scheduling app with AI summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&family=Dancing+Script:wght@400;700&family=Pacifico&family=Caveat:wght@400;700&family=Kalam:wght@300;400;700&family=Architects+Daughter&family=Playfair+Display:wght@400;700&family=Merriweather:wght@300;400;700&family=Crimson+Text:wght@400;600&family=Fira+Code:wght@300;400;500&family=Source+Code+Pro:wght@300;400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
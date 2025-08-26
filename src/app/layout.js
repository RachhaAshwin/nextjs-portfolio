import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './components/theme-provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ashwin Rachha',
  description: 'Ashwin Rachha`s Personal Website, Blog and Chatbot.',
  icons: {
    icon: "images/Ashwin.png",
  },
  icon: "images/Ashwin.png" 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <Head><link rel="shortcut icon" href="images/Ashwin.png" /></Head>
      <Analytics />

      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

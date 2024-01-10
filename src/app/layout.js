import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head';

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
    <html lang="en">
      <Head><link rel="shortcut icon" href="images/Ashwin.png" /></Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

import { Inter, Urbanist } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
 
export const urbanist = Urbanist({  
    subsets: ['latin'],
    variable: '--font-roboto-mono',
    display: 'swap', 
});
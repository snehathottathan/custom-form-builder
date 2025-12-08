import { Geologica } from 'next/font/google'; // Only import one known good font
import ReduxProvider from './providers';

const geistasans = Geologica({
  subsets: ["latin"],
  variable: "--font-geista-sans",
});
// const geistaMono = ... (Comment this out)

export const metadata = { /* ... */ };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Remove the second variable until fixed */}
      <body className={geistasans.variable}> 
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
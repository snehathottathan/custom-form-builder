import Head from 'next/head'; // Import the Head component
import { Geologica } from 'next/font/google'; 
import ReduxProvider from './providers';

// Configure font
const geistasans = Geologica({
  subsets: ["latin"],
  variable: "--font-geista-sans",
});
// (Keep geistaMono commented out as per your previous request until resolution)

export const metadata = {
  title: "Form Builder App",
  description: "Advanced Form Builder with Conditional Logic and DnD.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 1. Use the Head component to place elements inside <head> 
        2. Adding precedence="default" to resolve the Next.js warning
      */}
      <Head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
          // Adding precedence="default" helps Next.js understand the loading order
          // Alternatively, Next.js often prefers link tags be moved to global.css
          precedence="default"
        />
      </Head>
      
      <body className={geistasans.variable}> 
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

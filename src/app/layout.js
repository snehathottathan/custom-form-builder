import Head from 'next/head'; // Import the Head component
import { Geologica } from 'next/font/google'; 
import ReduxProvider from './../app/providers';

import './globals.scss'

const geistasans = Geologica({
  subsets: ["latin"],
  variable: "--font-geista-sans",
});

export const metadata = {
  title: "Form Builder App",
  description: "Advanced Form Builder with Conditional Logic and DnD.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
   
      <Head>
       
      </Head>
      
      <body className={geistasans.variable}> 
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

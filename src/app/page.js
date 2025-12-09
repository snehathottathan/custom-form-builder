// HomePage.js (The file containing the export default function HomePage)
'use client'
import React, { Suspense } from 'react';
import { useIsHydrated } from '../app/hooks/useIsHydrated'; // <-- NEW IMPORT

// Import global styles 
import '../../src/app/globals.scss'; 

// Lazy load the MainBuilder as it's a large, complex component
const MainBuilder = React.lazy(() => import('../app/components/Layout/Builder/MainBuilder'));

// Since MainBuilder contains client logic and hooks, this page should be a client component.
// Note: The "use client" directive is needed either here or in MainBuilder's parent.
// Assuming your provided code is the content of app/page.js or similar entry point:

export default function HomePage() {
  const isHydrated = useIsHydrated(); // Check if client-side hydration is complete

  return (
    <div>
      <Suspense fallback={<div>Loading Form Builder Interface...</div>}>
        {isHydrated ? (
            // 🎯 Only render MainBuilder AFTER hydration is complete 
            // This prevents the state mismatch between Server (empty) and Client (loaded from localStorage)
            <MainBuilder />
        ) : (
            // Show the loading fallback until the client is ready
            <div>Loading Form Builder Interface...</div>
        )}
      </Suspense>
    </div>
  );
}
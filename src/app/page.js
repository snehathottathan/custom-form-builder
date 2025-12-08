import React, { Suspense } from 'react';

// Import global styles (if you choose to keep them here or in layout.js)
import '../../src/app/globals.scss'; 

// Lazy load the MainBuilder as it's a large, complex component
const MainBuilder = React.lazy(() => import('../app/components/Layout/Builder/MainBuilder'));

// Since MainBuilder contains client logic and hooks, this page should be a client component.
// Alternatively, you could wrap the <MainBuilder> in a client component, but for simplicity here:


export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading Form Builder Interface...</div>}>
        <MainBuilder />
      </Suspense>
    </div>
  );
}
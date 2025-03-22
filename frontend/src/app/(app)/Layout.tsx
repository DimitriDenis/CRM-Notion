import { ReactNode } from "react";


// src/app/(app)/layout.tsx
export default function AppLayout({ children }: { children: ReactNode }) {
  // Pas de 'use client', pas de hooks, juste un rendu simple
  console.log("AppLayout rendering TEST");
  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px', background: 'blue', minHeight: '100vh' }}>
        SIDEBAR TEST
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ height: '60px', background: 'gray' }}>
          HEADER TEST
        </div>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
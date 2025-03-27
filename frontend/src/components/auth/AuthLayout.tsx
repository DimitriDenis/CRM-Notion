// src/components/auth/AuthLayout.tsx

'use client';


import { motion } from 'framer-motion';
import { ReactNode } from 'react';


export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">


      <div className="relative pt-12 pb-6 sm:pt-16 md:pt-20 lg:pt-24">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              <span className="block text-blue-600 dark:text-blue-400">NotionCRM</span>
              <span className="block text-3xl sm:text-4xl mt-2">Simplifiez votre relation client</span>
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>


    </div>
  );
}
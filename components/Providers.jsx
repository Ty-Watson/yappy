'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react'
import { Toaster } from 'react-hot-toast';

const Providers = ({children}) => {
  return (
    <>
        <SessionProvider>
            <Toaster  position='top-center' reverseOrder={false} />
            {children}
        </SessionProvider>
        
    </>
  )
}

export default Providers
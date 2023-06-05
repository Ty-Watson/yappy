'use client';

import React from 'react'
import {signIn, signOut, useSession, getProviders} from 'next-auth/react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';

const page = () => {

async function loginWithGoogle(){
    try {        
        await signIn('google')
    } catch (error) {
        toast.error("Something went wrong");
    }
    
}


  return <>
    <button onClick={loginWithGoogle}>
      Login
    </button>
          
  </>
}

export default page
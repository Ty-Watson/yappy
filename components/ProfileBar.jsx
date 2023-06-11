'use client';
import Image from 'next/image'
import React from 'react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link';


const ProfileBar =  ({ session}) => {
 

  return (
    <Link href="/dashboard">
      <div className='flex items-center w-full relative'>
        <div className='mr-2'>
            <Image 
            src={session?.user?.image || ''}
            width={50} 
            height={40} 
            alt='profile_pic'
            className='inline-block rounded-full object-cover w-10 h-10 m-2' 
            />
        </div>
        <div className='flex flex-col'>
          <h3 className='text-left'>{session?.user?.name}</h3>
          <p className='text-xs '>{session?.user?.email}</p>
        </div>    
        
      </div>
    </Link>
    
  )
}

export default ProfileBar
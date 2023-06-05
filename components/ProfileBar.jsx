'use client';
import Image from 'next/image'
import React from 'react'


const ProfileBar = ({ name}) => {
  return (
    <div className='flex items-center w-full relative'>
        <div className='mr-2'>
            <Image 
            src='/images/profile.jpg' 
            width={50} 
            height={40} 
            alt='profile_pic'
            className='inline-block rounded-full object-cover w-10 h-10 m-2' 
            />
        </div>
        <div className='flex flex-col'>
          <h3 className='text-right'>{name}</h3>
          <p className='text-xs '>@TyWatson</p>
        </div>    
        
    </div>
  )
}

export default ProfileBar
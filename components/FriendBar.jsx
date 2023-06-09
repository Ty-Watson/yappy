import React from 'react'
import Image from 'next/image'

const FriendBar = ({friend}) => {
  return (
    <div className='flex items-center w-full relative'>
        <div className='mr-2'>
            <Image 
            src={friend.image || ''}
            width={50} 
            height={40} 
            alt='profile_pic'
            className='inline-block rounded-full object-cover w-10 h-10 m-2' 
            />
        </div>
        <div className='flex flex-col'>
          <h3 className='text-left'>{friend.name}</h3>
          <p className='text-xs '>{friend.email}</p>
        </div>    
        
    </div>
  )
}

export default FriendBar
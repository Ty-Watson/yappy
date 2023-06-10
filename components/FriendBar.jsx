import React from 'react'
import Image from 'next/image'

const FriendBar = ({friend, unseenMessageCount}) => {
  return (
    <div className='flex items-center w-full relative  text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-full'>
        <div className='mr-2'>
            <Image 
            src={friend.image || ''}
            width={50} 
            height={40} 
            alt='profile_pic'
            className='inline-block rounded-full object-cover w-10 h-10 m-2' 
            />
        </div>
        <div className='flex flex-row'>
          <div className='flex flex-col '>
            <h3 className='text-left leading-6 font-semibold'>{friend.name}</h3>
            <p className='text-xs font-semibold'>{friend.email}</p>
          </div>
          {unseenMessageCount > 0 ? (
            <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
              {unseenMessageCount}
            </div>
          ) : null}    
        </div>
       
        
    </div>
  )
}

export default FriendBar
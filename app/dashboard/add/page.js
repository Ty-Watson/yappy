import React from 'react'
import AddFriendButton from '@/components/AddFriendButton'

const page = () => {
  return (
    <main className='md:pt-8 md:mt-0 md:p-0 mt-16 p-4'>
        <h1 className='font-bold text-5xl mb-8 dark:text-white'>Add a friend</h1>
        <AddFriendButton  />
    </main>
  )
}

export default page
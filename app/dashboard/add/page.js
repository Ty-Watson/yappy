import React from 'react'
import AddFriendButton from '@/components/AddFriendButton'

const page = () => {
  return (
    <main className='lg:pt-8 lg:mt-0 lg:p-0 mt-16 p-4'>
        <h1 className='font-bold text-5xl mb-8 dark:text-white'>Add a friend</h1>
        <AddFriendButton  />
    </main>
  )
}

export default page
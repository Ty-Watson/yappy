import React from 'react'
import AddFriendButton from '@/components/AddFriendButton'

const page = () => {
  return (
    <main className='pt-8'>
        <h1 className='font-bold text-5xl mb-8 dark:text-white'>Add a friend</h1>
        <AddFriendButton  />
    </main>
  )
}

export default page
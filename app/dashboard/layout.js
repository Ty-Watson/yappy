import SideBar from '@/components/SideBar'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'

const people = [
    {
      "id": 1,
      "Name": "John Smith"
    },
    {
      "id": 2,
      "Name": "Ron Smith"
    },
    {
      "id": 3,
      "Name": "Tyler Smith"
    },
    {
      "id": 4,
      "Name": "Phil Smith"
    },
    {
      "id": 5,
      "Name": "Baker Smith"
    },
  ]

const layout = async ({children}) => {

    const session = await getServerSession(authOptions)
    console.log(session)

    const friends = await getFriendsByUserId(session.user.id)

    if(!session) notFound()

    const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)).length

  return (
    <div className='w-full flex h-screen'>
       <div className='flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto px-6'>
           
            <SideBar people={people} session={session} unseenRequestCount={unseenRequestCount} friends={friends}/>

            
        </div> 
        {children}
    </div>
  )
}

export default layout
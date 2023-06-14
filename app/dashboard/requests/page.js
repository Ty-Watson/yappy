import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import FriendRequests from '@/components/FriendRequests'

const page = async () => {
    const session = await getServerSession(authOptions)
    //console.log(`REQUEST SESSION: ${(await session).user.id}`)
    if(!session) notFound()

    //ids of people who sent current logged in user a friend requests
    // 3:10:07
    const incomingSenderIds = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = await fetchRedis('get', `user:${senderId}`)
            const senderParsed = JSON.parse(sender)
            return {
                senderId,
                senderEmail: senderParsed.email
            }
        })
    )    
  return (
    <main className='pt-8'>
        <h1 className='font-bold text-5xl mb-8 dark:text-white'>Requests</h1>
        <div className='flex flex-col gap-4'>
            <FriendRequests  incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
        </div>
    </main>
  )
}

export default page
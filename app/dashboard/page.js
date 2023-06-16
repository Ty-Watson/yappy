import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

const page = async () => {

  const session = await getServerSession(authOptions)
  if(!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)
  //7:32:11
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = await fetchRedis('zrange', `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1)
      
      const lastMessage = JSON.parse(lastMessageRaw)

      return{
        ...friend,
        lastMessage
      }
    })   
  )
  console.log("friendswithlastmessage", friendsWithLastMessage)
  return (
    <div className='py-12 px-2 mt-4'>
      <h1 className='font-bold text-5xl mb-8 dark:text-white'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500 dark:text-white'>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-lg dark:bg-[#323645] dark:border-indigo-600'>
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-zinc-400 dark:text-indigo-600' />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative sm:flex'>
              <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-6 w-6'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className='text-lg font-semibold dark:text-white'>{friend.name}</h4>
                <p className='mt-1 max-w-md dark:text-white'>
                  <span className='text-zinc-400 dark:text-white'>
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default page
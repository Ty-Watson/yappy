import SideBar from '@/components/SideBar'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import MobileChatLayout from '@/components/MobileChatLayout'


const sidebarOptions = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const layout = async ({children}) => {

    const session = await getServerSession(authOptions)    

    const friends = await getFriendsByUserId(session.user.id)

    if(!session) notFound()

    const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)).length

  return (
    <div className='w-full flex h-screen bg-[#f3f4f6] dark:bg-[#282a37]'>
      <div className='lg:hidden gap-2'>
        <MobileChatLayout friends={friends} unseenRequestCount={unseenRequestCount} sidebarOptions={sidebarOptions} session={session} />
      </div>
       <div className='hidden lg:flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto px-6 '>
           
          <SideBar session={session} unseenRequestCount={unseenRequestCount} friends={friends}/>
            
        </div> 
        {children}
    </div>
  )
}

export default layout
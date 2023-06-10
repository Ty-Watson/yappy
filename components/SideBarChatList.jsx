'use client';
import { chatHrefConstructor } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import {useEffect, useState} from 'react'
import FriendBar from './FriendBar';
//4:46:18
const SideBarChatList = ({friends, session}) => {
const router = useRouter()
const pathname = usePathname()
const [unseenMessages, setUnseenMessages] = useState([])

useEffect(() => {
    if(pathname?.includes('chat')){
        setUnseenMessages((prev) => {
            return prev.filter((msg) => !pathname.includes(msg.senderId))
        })
    }
}, [pathname])

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {friends.sort().map((friend) => {
            const unseenMessageCount = unseenMessages.filter((unseenMsg) => {
                return unseenMsg.senderId === friend.id
            }).length
            return (
                <li key={friend.id}>
                    <a href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}><FriendBar friend={friend} unseenMessageCount={unseenMessageCount}/></a>
                </li>
            )
        })}
    </ul>
  )
}

export default SideBarChatList
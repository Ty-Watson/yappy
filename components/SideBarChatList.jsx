'use client';
import { chatHrefConstructor } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import {useEffect, useState} from 'react'
import FriendBar from './FriendBar';
import { toast } from 'react-hot-toast';
import { toPusherKey } from '@/lib/utils';
import UnseenChatToast from './UnseenChatToast';
import { pusherClient } from '@/lib/pusher';
//4:46:18
const SideBarChatList = ({friends, sessionId, searchInput}) => {
const router = useRouter()
const pathname = usePathname()
const [unseenMessages, setUnseenMessages] = useState([])
//6:45:00
//listening to incoming unseen message to pop up a toast notification
useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const newFriendHandler = (newFriend) => {
      console.log("received new user", newFriend)
    //   setActiveChats((prev) => [...prev, newFriend])
    }

    const chatHandler = (message) => {
        console.log('new chat message', message)
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

      if (!shouldNotify) return

      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind('new_message', chatHandler)
    pusherClient.bind('new_friend', newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind('new_message', chatHandler)
      pusherClient.unbind('new_friend', newFriendHandler)
    }
  }, [pathname, sessionId, router])

useEffect(() => {
    if(pathname?.includes('chat')){
        setUnseenMessages((prev) => {
            return prev.filter((msg) => !pathname.includes(msg.senderId))
        })
    }
}, [pathname])

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {searchInput ? (
             // Filter friends and assign the result to searchResult
            friends
            .filter((friend) => friend.name.includes(searchInput))
            .map((friend) => {
                const unseenMessageCount = unseenMessages.filter((unseenMsg) => unseenMsg.senderId === friend.id).length;
                return (
                <li key={friend.id}>
                    <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}>
                    <FriendBar friend={friend} unseenMessageCount={unseenMessageCount} />
                    </a>
                </li>
                );
            })
        ) : (
            friends.sort().map((friend) => {
                const unseenMessageCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend.id
                }).length
                return (
                    <li key={friend.id}>
                        <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}><FriendBar friend={friend} unseenMessageCount={unseenMessageCount}/></a>
                    </li>
                )
            })
        )}
        
    </ul>
  )
}

export default SideBarChatList
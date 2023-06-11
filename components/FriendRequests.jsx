"use client";
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {useState, useEffect} from 'react'

const FriendRequests = ({sessionId, incomingFriendRequests}) => {
    const [friendRequests, setFriendRequests] = useState(incomingFriendRequests)

    const router = useRouter()
    //6:16:00
    useEffect(() => {
      pusherClient.subscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_request`)
      ) 

      console.log("subscribed to", `user:${sessionId}:incoming_friend_request`)
      const friendRequestHandler = ({senderId, senderEmail}) => {
        setFriendRequests((prev) => [...prev, {senderId, senderEmail}])
      }
     
      pusherClient.bind('incoming_friend_request', friendRequestHandler)  

      return () => {
        pusherClient.unsubscribe(
          toPusherKey(`user:${sessionId}:incoming_friend_request`)
        ) 
  
        pusherClient.unbind('incoming_friend_request', friendRequestHandler)  
      }
     
     
    }, [sessionId])
    
    
    const acceptFriend = async (senderId) => {
        await axios.post('/api/friends/accept', {id: senderId})

        // take accepted friend out of the state
        setFriendRequests((prev => prev.filter((request) => request.senderId !== senderId)))

        router.refresh()
    }
    const denyFriend = async (senderId) => {
        await axios.post('/api/friends/deny', {id: senderId})

        // take denied friend out of the state
        setFriendRequests((prev => prev.filter((request) => request.senderId !== senderId)))

        router.refresh()
    }

  return (
    <>
    {friendRequests.length === 0 ? (
      <p className='text-sm text-zinc-500'>Nothing to show here...</p>
    ) : (
      friendRequests.map((request) => (       
        <div key={request.senderId} className='flex gap-4 items-center'>
          <UserPlus className='text-black' />
          <p className='font-medium text-lg'>{request.senderEmail}</p>
          <button
            onClick={() => acceptFriend(request.senderId)}
            aria-label='accept friend'
            className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <Check className='font-semibold text-white w-3/4 h-3/4' />
          </button>

          <button
            onClick={() => denyFriend(request.senderId)}
            aria-label='deny friend'
            className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <X className='font-semibold text-white w-3/4 h-3/4' />
          </button>
        </div>
      ))
    )}
  </>
  )
}

export default FriendRequests
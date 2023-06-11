'use client'
import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

//flex-col-reverse turns messages upside down
const Messages = ({initialMessages, sessionId, chatPartner, sessionImg, chatId}) => {

    const [messages, setMessages] = useState(initialMessages)

    const scrollDownRef = useRef(null)

    useEffect(() => {
        pusherClient.subscribe(
          toPusherKey(`chat:${chatId}`)
        ) 
        //6:30:47
        const messageHandler = (message) => {
         setMessages((prev) => [message, ...prev])
        }
       
        pusherClient.bind('incoming-message', messageHandler)  
  
        return () => {
          pusherClient.unsubscribe(
            toPusherKey(`chat:${chatId}`)
          ) 
    
          pusherClient.bind('incoming-message', messageHandler)  
        }
      }, [chatId])

  return (
    <div id='messages' className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
        <div ref={scrollDownRef} />


        {messages.map((message, index) => {
            const isCurrentUser = message.senderId === sessionId

            const hasNextMessageFromSameUser = messages[index-1]?.senderId === messages[index].senderId

            return (
                <div key={`${message.id}-${message.timestamp}`} className='chat-message'>
                     <div className={cn('flex items-end', {'justify-end' : isCurrentUser})}>
                        <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                            'order-1 items-end': isCurrentUser, 
                            'order-2 items-start': !isCurrentUser
                        })}>
                            <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                'bg-indigo-600 text-white': isCurrentUser,
                                'bg-gray-200 text-gray-900': !isCurrentUser,
                                'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                'rounded-bl-none': !hasNextMessageFromSameUser && isCurrentUser,
                            })}>
                                {message.text}{' '}
                                <span className='ml-2 text-xs text-gray-400'>
                                    {Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'}).format(message.timestamp)}
                                </span>
                            </span>
                        </div>
                        <div
                            className={cn('relative w-6 h-6', {
                            'order-2': isCurrentUser,
                            'order-1': !isCurrentUser,
                            invisible: hasNextMessageFromSameUser,
                            })}>
                            <Image
                            fill
                            src={
                                isCurrentUser ? sessionImg : chatPartner.image
                            }
                            alt='Profile picture'
                            referrerPolicy='no-referrer'
                            className='rounded-full'
                            />
                        </div>
                     </div>
                </div>

            )
        })}
    </div>
  )
}

export default Messages
import React from 'react'
import SideBar from '@/components/SideBar'
import ProfileBar from '@/components/ProfileBar'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { fetchRedis } from '@/helpers/redis'
import { messageArrayValidator } from '@/lib/validations/message'
import { db } from '@/lib/db'
import FriendBar from '@/components/FriendBar'
import Messages from '@/components/Messages'
import ChatInput from '@/components/ChatInput'

//4:19:05
async function getChatMessages(chatId){
  try {
    const results = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1)

    const dbMessages = results.map((message) => JSON.parse(message))

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  } catch (error) {
    notFound()
  }
}
//params come in automatically because /[chatId]
const page = async ({params}) => {
  //destructuring params
  const {chatId} = params

  const session = await getServerSession(authOptions)
  if(!session) notFound()

  const {user} = session

  const [userId1, userId2] = chatId.split('--')

  if(user.id !== userId1 && user.id !== userId2){
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerRaw = await fetchRedis('get', `user:${chatPartnerId}`)
  const chatPartner = JSON.parse(chatPartnerRaw)
  const initialMessages = await getChatMessages(chatId)

  return (   
        
        <div className='w-full flex flex-col justify-between h-full lg:pr-28'>
          <div className='w-full md:h-[100px] lg:mr-10 lg:m-6 md:mt-16 mt-16 rounded-xl flex  items-center bg-white dark:bg-[#323645]'>
            <div className='md:m-4 xl:w-1/3 w-full items-end m-2'>
              <FriendBar friend={chatPartner} />
            </div>
          </div>
          <Messages initialMessages={initialMessages} sessionId={session.user.id} chatPartner={chatPartner} sessionImg={session.user.image} chatId={chatId} />
          <ChatInput  chatPartner={chatPartner} chatId = {chatId}/>          
        </div>      
    
  )
}

export default page
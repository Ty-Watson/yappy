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
  const chatPartner = (await db.get(`user:${chatPartnerId}`))
  const initialMessages = await getChatMessages(chatId)

  return (
    
        

        <div className='w-full flex flex-col justify-between  pr-28'>
          <div className='w-full h-[100px] mr-10 m-6 rounded-xl flex  items-center bg-gray-200'>
            <div className='m-4'>
              <FriendBar friend={chatPartner} />
            </div>
          </div>
          <Messages initialMessages={initialMessages} sessionId={session.user.id} />

          <ChatInput  chatPartner={chatPartner} chatId = {chatId}/>


          
        </div>       
    
  )
}

export default page
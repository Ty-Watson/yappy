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
    <div className='flex flex-row h-full w-full'>
        

        <div className='w-full flex flex-col justify-between'>
          <div className='w-full h-[100px] m-4 rounded-xl flex  items-center bg-gray-200'>
            <div className=''>
              {params.chatId}
            </div>
          </div>

          <div className='w-full m-4  bg-white h-[50px] rounded-full p-3 flex flex-row items-center justify-between'>
            <input 
              placeholder='Type a message'
              className=' text-sm font-medium focus:border-black focus:outline-none focus:ring-0 peer w-[50%]'
            
            />
            <div className='flex flex-row '>
              <Image src='/icons/face-smile-regular.svg' alt='emoji' height={20} width={20}  className='mr-10'/>
              <Image  src="/images/paper-plane-solid.svg" alt='send' height={20} width={20} className='mr-10'/>
            </div>
            
          </div>
        </div>       
    </div>
  )
}

export default page
'use-client';
import React from 'react'
import SideBar from '@/components/SideBar'
import ProfileBar from '@/components/ProfileBar'
import Image from 'next/image'

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

const page = () => {
  return (
    <div className='flex flex-row h-full w-full'>
        <SideBar people={people} />

        <div className='w-full flex flex-col justify-between'>
          <div className='w-full h-[100px] m-4 rounded-xl flex  items-center bg-gray-200'>
            <div className=''>
              <ProfileBar name={"Ty Watson"} />
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
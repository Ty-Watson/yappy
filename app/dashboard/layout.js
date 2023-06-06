import SideBar from '@/components/SideBar'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'

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

const layout = async ({children}) => {

    const session = await getServerSession(authOptions)

    if(!session) notFound()

  return (
    <div className='w-full flex h-screen'>
       <div className='flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto px-6'>
            {/* <Link href='/dashboard'>

            </Link> */}
            <SideBar people={people}/>
        </div> 
        {children}
    </div>
  )
}

export default layout
"use client";
import React from 'react'
import ProfileBar from './ProfileBar'
import Image from 'next/image'
import SearchBar from './SearchBar'
import Link from 'next/link';



const SideBar = ({people}) => {
  return (
    <div className="w-full max-w-sm h-full flex flex-col p-5 m-2  bg-gray-100">
      <div className="w-full h-fit flex items-center justify-between mb-5">
        <ProfileBar name={"Ty Watson"} />
        <div className="ml-auto">
          <Image 
            src="/images/bell-solid.svg" 
            alt="bell" 
            height={20} 
            width={20} 
          />
        </div>
      </div>
      <div className='w-full   rounded-3xl h-full flex flex-col p-5 relative align-center bg-white'>
        <SearchBar  />
        <div className='m-2'>
          {people.map((people) => <ProfileBar name={people.Name} key={people.id} />)}
        </div>
        
        <div className='flex flex-col p-2 m-2 mt-auto'>
          <Link href='dashboard/add' className='flex items-center mb-4'>
            <Image 
              src='/icons/user-plus-solid.svg'
              alt='add user'
              height={30}
              width={30}
              className='mr-2'
            /> 
            <p className='inline'>Add Friend</p>
          </Link>
          <Link href='dashboard/add' className='flex items-center'>
            <Image 
              src='/icons/user-plus-solid.svg'
              alt='add user'
              height={30}
              width={30}
              className='mr-2'
            /> 
            <p className='inline'>Friend Requests</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SideBar
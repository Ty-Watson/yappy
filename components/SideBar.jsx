"use client";
import React from 'react'
import ProfileBar from './ProfileBar'
import Image from 'next/image'
import SearchBar from './SearchBar'



const SideBar = ({people}) => {
  return (
    <div className="w-[500px] h-full flex flex-col p-5 m-2  bg-gray-100">
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
        

      </div>
    </div>
  )
}

export default SideBar
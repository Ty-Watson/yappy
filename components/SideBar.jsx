"use client";
import React, { useState } from 'react'
import ProfileBar from './ProfileBar'
import Image from 'next/image'
import SearchBar from './SearchBar'
import Link from 'next/link';
import SignOutButton from './SignOutButton';
import FriendRequestSidebarOptions from './FriendRequestSidebarOptions';
import { User } from 'lucide-react';
import SideBarChatList from './SideBarChatList';



const SideBar = ({people, session, unseenRequestCount, friends }) => {

  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="w-full max-w-sm h-full flex flex-col p-5 m-2  bg-gray-100">
      <div className="w-full h-fit flex items-center justify-between mb-5">
        <ProfileBar name={"Ty Watson"} session={session} />
        <div className="ml-auto">
          <SignOutButton  className='h-full aspect-square'/>
        </div>
      </div>
      <div className='w-full   rounded-3xl h-full flex flex-col p-5 relative align-center bg-white'>
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
        {friends.length > 0 ? (
             <div className='text-xs font-semibold leading-6 text-gray-400 mt-5'>
                Your Chats
             </div>
        ) : null}
       

        <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                  <SideBarChatList friends={friends} sessionId={session.user.id} searchInput={searchInput}/>
                </li>
            </ul>
        </nav>
        
        {/*2:42:00 styling sidebar options */}
        <div className='flex flex-col p-2 m-2 mt-auto'>
          <Link
            href='/dashboard/add'
            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
          >
              <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                  <User className='h-4 w-4' />
              </div>
              <p className='truncate'>Add Friend</p>

              
              
          </Link>
          {/*2:57:00 */}
          <FriendRequestSidebarOptions sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount}/>
        </div>
      </div>
    </div>
  )
}

export default SideBar
'use client'
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Image from 'next/image'
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ChatInput = ({chatPartner, chatId}) => {
    const textareaRef = useRef(null)
    const [input, setInput] = useState('')

    const sendMessage = async () => {
        if(!input) return
        try {
            //await new Promise((resolve) => setTimeout(resolve, 1000))
            await axios.post('/api/message/send', {text: input, chatId})
            setInput('')
            textareaRef.current?.focus()
        } catch (error) {
            toast.error('Something went wrong. Please try again later')
        }        
    }

  return (
    <div className='border-t border-gray-200 px-4 pt-4 md:mb-10'>
        <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 flex flex-row'>
            <TextareaAutosize ref={textareaRef} onKeyDown={(e) => {
                if(e.key ==='Enter' && !e.shiftKey){
                    e.preventDefault()
                    sendMessage()
                }
            }} 
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${chatPartner.name}`}
            className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 leading-6 sm:py-1.5'
            />
            <div className='flex flex-row '>
                <Image src='/icons/face-smile-regular.svg' alt='emoji' height={20} width={20}  className='mr-10' />
                <button onClick={sendMessage}>
                    <Image  src="/images/paper-plane-solid.svg" alt='send' height={20} width={20} className='mr-10' />
                </button>
                
            </div>            
        </div>
        
    </div>
  )
}

export default ChatInput
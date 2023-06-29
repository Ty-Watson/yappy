import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { messageValidator } from "@/lib/validations/message"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"
import { toPusherKey } from "@/lib/utils"
//5:51:29
export async function POST(req){
    try {
        const {text, chatId} = await req.json()
        const session = await getServerSession(authOptions)

        if(!session){
            return new Response('Unauthorized', {status: 401})
        }

        const [userId1, userId2] = chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !== userId2){
            return new Response('Unauthorized', {status: 401})
        }


        const friendId = session.user.id === userId1 ? userId2 : userId1

        const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`)
        const isFriends = friendList.includes(friendId)

        if(!isFriends){
            return new Response('Unauthorized', {status: 401})
        }

        const rawSender = await fetchRedis('get', `user:${session.user.id}`)
        const sender = JSON.parse(rawSender)
        const timestamp = Date.now()

        const messageData = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp
        }

        const message = messageValidator.parse(messageData)

        //notify all connected chat room clients
        //trigger(event subscribed too, event name want to trigger, data want to pass to front end)
        //6:32:00
        await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)
        //6:47:21 define what spreading is
        await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
            ...message,
            senderImg: sender.image,
            senderName: sender.name
        })

        //all valid, send message
        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 })
          }
      
        return new Response('Internal Server Error', { status: 500 })
    }
}
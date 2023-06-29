import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req){
    try {
        const body = await req.json()

        

        const {email: emailToAdd} = addFriendValidator.parse(body.email)

       //console.log(`EMAIL TO ADD: ${emailToAdd}`)

        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`)

        //console.log(`ID TO ADD: ${idToAdd}`);       
        

        if(!idToAdd){
            return new Response('This person does not exist.' ,{status: 400})
        }

        const session = await getServerSession(authOptions)

        if(!session){
            return new Response('Unauthorized', {status: 401})
        }

        if(idToAdd === session.user.id){
            return new Response('You cannot add yourself as a friend', {status: 400})
        }

        //check if user is already added 
        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id)

        if(isAlreadyAdded){
            return new Response('Already added this user', {status: 400})
        }
        //check if user already friends 
        const isAlreadyFriends = await fetchRedis('sismember', `user:${idToAdd}:friends`, idToAdd)

        if(isAlreadyFriends){
            return new Response('Already friends', {status: 400})
        }

        //valid request, send friend request

        await pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_request`),
             'incoming_friend_request',
            {
                senderId: session.user.id,
                senderEmail: session.user.email
            }
        )

        await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return new Response('OK')        
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}
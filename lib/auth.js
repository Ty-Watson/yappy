
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import { fetchRedis } from '@/helpers/redis'


function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}


export const authOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: "171496626162-q1s83vu3ao1t05rb79ich66b7kij7vl7.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) 

      if (!dbUserResult) {
        if (user) {
          token.id = user.id
        }

        return token
      }

      const dbUser = JSON.parse(dbUserResult)
      console.log(`THIS IS THE LOGGED IN USER: ${dbUser.email}`)
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      console.log(`SESSION IMAGE: ${session.user.image}`)
      return session
    },
    redirect(){
        return '/dashboard'
    }
    
  },
}
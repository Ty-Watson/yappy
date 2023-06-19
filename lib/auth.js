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
  secret: process.env.NEXTAUTH_SECRET,
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("Token entering jwt", token)
      console.log("User entering jwt", user)
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) 
      console.log("DBUserResult", dbUserResult)
      if (!dbUserResult) {
        if (user) {
          token.id = user.id
        }

        return token
      }
      debugger;
      const dbUser = JSON.parse(dbUserResult)

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      console.log("SESSION TOKEN", token)
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      debugger;
      console.log("SESSION BEING RETURN", session)
      return session
    },
    redirect() {
      return '/dashboard'
    },
  },
}
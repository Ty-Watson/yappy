import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import {  useState } from 'react'
import { toast } from 'react-hot-toast'


const SignOutButton = ({ ...props }) => {
    const [isSigningOut, setIsSigningOut] = useState(false)
    return (
      <button
        {...props}       
        onClick={async () => {
          setIsSigningOut(true)
          try {
            await signOut()
          } catch (error) {
            toast.error('There was a problem signing out')
          } finally {
            setIsSigningOut(false)
          }
        }}>
        {isSigningOut ? (
          <Loader2 className='animate-spin h-4 w-4' />
        ) : (
          <LogOut className='w-6 h-6' />
        )}
      </button>
    )
  }

export default SignOutButton
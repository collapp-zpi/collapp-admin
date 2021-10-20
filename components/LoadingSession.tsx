import { useSession } from 'next-auth/react'
import React, { ReactNode } from 'react'
import Loading from './Loading'
import SignIn from './SignIn'

const LoadingSessionLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'unauthenticated') {
    return <SignIn />
  }

  return <div>{children}</div>
}

export default LoadingSessionLayout

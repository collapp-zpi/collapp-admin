import { useSession } from 'next-auth/react'
import React, { ReactNode } from 'react'
import Loading from './Loading'
import NavigationPanel from './NavigationPanel'
import SignIn from './SignIn'

const LoadingSessionLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'unauthenticated') {
    return <SignIn />
  }

  return <NavigationPanel>{children}</NavigationPanel>
}

export default LoadingSessionLayout

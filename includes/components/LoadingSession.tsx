import { useSession } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import NavigationPanel from './NavigationPanel'
import SignIn from './SignIn'

const LoadingSessionLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex justify-center align-middle h-full min-h-screen">
        <LogoSpinner />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <SignIn />
  }

  return <NavigationPanel>{children}</NavigationPanel>
}

export default LoadingSessionLayout

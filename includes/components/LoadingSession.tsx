import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import NavigationPanel from './NavigationPanel'
import SignIn from './SignIn'

const LoadingSessionLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status])

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

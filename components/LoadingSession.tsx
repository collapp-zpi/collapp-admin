import { useSession } from 'next-auth/react'
import React, { ReactNode } from 'react'
import Loading from './Loading'

const LoadingSessionLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()

  if (status == 'loading') {
    return <Loading />
  }

  return <div>{children}</div>
}

export default LoadingSessionLayout

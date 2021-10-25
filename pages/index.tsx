import { signOut } from 'next-auth/react'
import React from 'react'
import LoadingSessionLayout from '../includes/components/LoadingSession'
import Button from '../shared/components/button/Button'

const Home = () => {
  return (
    <LoadingSessionLayout>
      <h1>test</h1>
      <Button onClick={() => signOut()}>Sign out</Button>
    </LoadingSessionLayout>
  )
}

export default Home

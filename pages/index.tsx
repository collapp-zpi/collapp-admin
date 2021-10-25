import HomePage from 'includes/components/HomePage'
import React from 'react'
import LoadingSessionLayout from '../includes/components/LoadingSession'

const Home = () => {
  return (
    <LoadingSessionLayout>
      <HomePage></HomePage>
    </LoadingSessionLayout>
  )
}

export default Home

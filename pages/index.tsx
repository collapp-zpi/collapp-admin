import HomePage from 'includes/components/HomePage'
import React from 'react'
import LoadingSessionLayout from '../includes/components/LoadingSession'
import Head from 'next/head'

const Home = () => {
  return (
    <div>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingSessionLayout>
        <HomePage></HomePage>
      </LoadingSessionLayout>
    </div>
  )
}

export default Home

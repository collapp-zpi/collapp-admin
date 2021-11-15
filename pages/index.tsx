import React from 'react'
import LoadingSessionLayout from '../includes/components/LoadingSession'
import Head from 'next/head'
import Button from 'shared/components/button/Button'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingSessionLayout>
        <div className="flex justify-center align-middle">
          <div className="m-auto bg-gray-50 shadow-2xl p-12 rounded-3xl">
            <div className="flex flex-col text-center justify-center mb-16">
              <img src="/collapp.svg" className="mx-auto mb-0 w-24" />
              <h1 className="text-4xl font-bold">Welcome back!</h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => router.push('panel/developers')}>
                Developers
              </Button>
              <Button onClick={() => router.push('panel/plugins')}>
                Plugins
              </Button>
            </div>
          </div>
        </div>
      </LoadingSessionLayout>
    </div>
  )
}

export default Home

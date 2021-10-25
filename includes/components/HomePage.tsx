import { useRouter } from 'next/router'
import React from 'react'
import Button from 'shared/components/button/Button'

const HomePage = () => {
  const router = useRouter()
  return (
    <div className="flex justify-center align-middle">
      <div className="m-auto bg-gray-50 shadow-2xl p-8 rounded-2xl">
        <div className="flex items-end mb-4">
          <img src="/collapp.svg" className="mx-auto mb-0 w-44" />
          <h1 className="text-4xl font-medium mb-12">Welcome back!</h1>
        </div>
        <div className="flex justify-center space-x-8">
          <Button
            className="flex-1 border-2 border-gray-500"
            color="light"
            onClick={() => {
              router.push('panel/developers')
            }}
          >
            Developers
          </Button>
          <Button
            className="flex-1 border-2 border-gray-500"
            color="light"
            onClick={() => {
              router.push('panel/plugins')
            }}
          >
            Plugins
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage

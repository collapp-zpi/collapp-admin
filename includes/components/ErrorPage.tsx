import React from 'react'

const ErrorPage = ({
  statusCode,
  message,
}: {
  statusCode: number
  message: string
}) => {
  return (
    <main className="flex h-full min-h-screen">
      <div className="flex items-center m-auto bg-purple-50 shadow-xl py-6 px-10 align-middle">
        <h1 className="mr-10 text-4xl">{statusCode}</h1>
        <div className="bg-black w-px h-12" />
        <h2 className="pl-2">{message}</h2>
      </div>
    </main>
  )
}

export default ErrorPage

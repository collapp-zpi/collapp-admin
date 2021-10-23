import React from 'react'

const ErrorPage = ({
  statusCode,
  message,
}: {
  statusCode: number
  message: string
}) => {
  return (
    <>
      <h1>{statusCode}</h1>
      <h2>{message}</h2>
    </>
  )
}

export default ErrorPage

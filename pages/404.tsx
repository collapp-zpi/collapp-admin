import ErrorPage from 'includes/components/ErrorPage'
import React from 'react'

export default function Error() {
  return (
    <>
      <ErrorPage statusCode={404} message="Page not found" />
    </>
  )
}

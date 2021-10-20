import React from 'react'
import { CgSpinner } from 'react-icons/cg'

const Loading = () => {
  return (
    <main className="h-full">
      <CgSpinner size="4rem" className="animate-spin m-auto" />
    </main>
  )
}

export default Loading

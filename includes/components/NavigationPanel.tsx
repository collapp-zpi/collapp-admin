import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import Button from 'shared/components/button/Button'
import { NavbarLogo } from 'shared/components/NavbarLogo'
import { VscSignOut } from 'react-icons/vsc'

const NavigationPanel = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full min-h-screen ">
      <div className="flex items-center text-gray-700 border-2">
        <div className="flex space-x-3 items-center ml-1 my-4">
          <NavbarLogo width="2rem"></NavbarLogo>
          <h1
            className="cursor-pointer"
            onClick={() => router.push('/panel/developers')}
          >
            Developers
          </h1>
          <h1
            className="cursor-pointer"
            onClick={() => router.push('/panel/plugins')}
          >
            Plugins
          </h1>
        </div>

        <Button
          className="ml-auto mr-0.5"
          onClick={() => {
            toast.success('Until next time!')
            setTimeout(() => signOut(), 2000)
          }}
        >
          <VscSignOut className="mr-1" />
          Sign out
        </Button>
      </div>
      <div className="flex justify-center flex-col flex-grow bg-gray-100">
        {children}
      </div>
    </div>
  )
}

export default NavigationPanel

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import Button from 'shared/components/button/Button'
import { NavbarLogo } from 'shared/components/NavbarLogo'
import { VscSignOut } from 'react-icons/vsc'
import { CgExtension } from 'react-icons/cg'
import { HiCode } from 'react-icons/hi'

const NavigationPanel = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full min-h-screen ">
      <div className="flex items-center text-gray-700 border-2">
        <div className="flex space-x-8 items-center ml-1 my-4">
          <NavbarLogo width="2rem"></NavbarLogo>
          <h1
            className="cursor-pointer flex items-center hover:text-black"
            onClick={() => router.push('/panel/developers')}
          >
            <HiCode className="mx-1" />
            Developers
          </h1>
          <h1
            className="cursor-pointer flex items-center hover:text-black"
            onClick={() => router.push('/panel/plugins')}
          >
            <CgExtension className="mx-1" />
            Plugins
          </h1>
        </div>

        <Button className="ml-auto mr-0.5" onClick={() => signOut()}>
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

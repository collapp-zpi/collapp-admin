import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import Button from 'shared/components/button/Button'
import { NavbarLogo } from 'shared/components/NavbarLogo'
import { VscSignOut } from 'react-icons/vsc'
import { CgExtension } from 'react-icons/cg'
import { HiCode } from 'react-icons/hi'

const NavigationPanel = ({
  children,
  hasContainer = true,
}: {
  children: ReactNode
  hasContainer?: boolean
}) => {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full min-h-screen text-gray-500 bg-gray-100">
      <div className="flex items-center border-b-2 bg-white p-2 mb-8">
        <div className="flex space-x-8 items-center">
          <NavbarLogo width="2rem" />
          <h1
            className="cursor-pointer flex items-center hover:text-black transition-colors"
            onClick={() => router.push('/panel/developers')}
          >
            <HiCode className="mx-1" />
            Developers
          </h1>
          <h1
            className="cursor-pointer flex items-center hover:text-black transition-colors"
            onClick={() => router.push('/panel/plugins')}
          >
            <CgExtension className="mx-1" />
            Plugins
          </h1>
        </div>

        <Button color="light" className="ml-auto" onClick={() => signOut()}>
          <VscSignOut className="mr-1" />
          Sign out
        </Button>
      </div>
      <div className="flex-grow pb-8 px-8">
        {hasContainer ? (
          <div className="container mx-auto max-w-screen-xl">{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default NavigationPanel

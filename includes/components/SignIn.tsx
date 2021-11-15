import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import SubmitButton from 'shared/components/button/SubmitButton'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { InputText } from 'shared/components/input/InputText'
import { MdAlternateEmail } from 'react-icons/md'
import { signIn } from 'next-auth/react'
import { RedirectableProviderType } from 'next-auth/providers'
import { AiOutlineMail } from 'react-icons/ai'
import { useRouter } from 'next/router'

const schema = object().shape({
  email: string().email().required(),
})

const onError = () => {
  toast.error('Email was not send.')
}

const query = async ({ email }: { email: string }) => {
  const response = await signIn<RedirectableProviderType>('email', {
    redirect: false,
    email,
  })
  if (!response || response.error) throw new Error('Login error')
}

const SignIn = () => {
  const router = useRouter()
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    router.push('/')
  }, [])

  const onSuccess = () => {
    setEmailSent(true)
    toast.success('Email was sent')
  }

  return (
    <div className="flex justify-center align-middle h-full min-h-screen bg-gray-100 text-gray-500 p-8">
      <div className="shadow-2xl m-auto p-8 rounded-3xl bg-gray-50">
        <div className="mb-12">
          <img src="/collapp.svg" className="mx-auto w-24" />
          <h1 className="text-center font-bold text-2xl">
            Collapp Admin Panel
          </h1>
        </div>

        {emailSent ? (
          <div className="flex flex-col md:flex-row items-center justify-center space-x-2 text-center">
            <AiOutlineMail className="flex-shrink-0" />
            <h2>The email has been sent to your inbox</h2>
          </div>
        ) : (
          <UncontrolledForm
            {...{ schema, query, onSuccess, onError }}
            className="flex flex-col"
          >
            <InputText
              type="email"
              name="email"
              label="Email"
              autoComplete="email"
              icon={MdAlternateEmail}
            />
            <SubmitButton className="mt-2" />
          </UncontrolledForm>
        )}
      </div>
    </div>
  )
}

export default SignIn

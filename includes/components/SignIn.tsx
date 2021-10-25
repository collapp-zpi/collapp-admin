import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import SubmitButton from '../../shared/components/button/SubmitButton'
import { UncontrolledForm } from '../../shared/components/form/UncontrolledForm'
import { InputText } from '../../shared/components/input/InputText'
import { MdAlternateEmail } from 'react-icons/md'
import { signIn } from 'next-auth/react'
import { RedirectableProviderType } from 'next-auth/providers'

const schema = object().shape({
  email: string().email().required(),
})

const onSuccess = () => {
  toast.success('Email was sent')
}

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

const SignIn = () => (
  <div className="flex justify-center align-middle h-full min-h-screen">
    <UncontrolledForm
      {...{ schema, query, onSuccess, onError }}
      className="m-auto"
    >
      <InputText
        type="email"
        name="email"
        label="Email"
        icon={MdAlternateEmail}
      />
      <SubmitButton className="ml-auto mr-auto" />
    </UncontrolledForm>
  </div>
)

export default SignIn

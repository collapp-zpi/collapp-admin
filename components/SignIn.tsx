import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import SubmitButton from '../shared/components/button/SubmitButton'
import { UncontrolledForm } from '../shared/components/form/UncontrolledForm'
import { InputText } from '../shared/components/input/InputText'
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
  console.log(email)
  const response = await signIn<RedirectableProviderType>('email', {
    redirect: false,
    email,
  })
  if (!response || response.error) throw new Error('Login error')
}

const SignIn = () => (
  <UncontrolledForm {...{ schema, query, onSuccess, onError }}>
    <InputText
      type="email"
      name="email"
      label="Email"
      icon={MdAlternateEmail}
    />
    <SubmitButton />
  </UncontrolledForm>
)

export default SignIn

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
  email: string().required(),
})

const onSuccess = (data: any) => {
  toast.success('Email was sent')
}

const onError = async (data: any) => {
  console.log(data)
  toast.error('Email was not send')
}

const query = async ({ email }: { email: string }) => {
  console.log(email)
  return signIn<RedirectableProviderType>('email', {
    redirect: false,
    email,
  })
}

const SignIn = () => {
  return (
    <UncontrolledForm {...{ schema, query, onSuccess, onError }}>
      <InputText name="email" label="Email" icon={MdAlternateEmail} />
      <SubmitButton />
    </UncontrolledForm>
  )
}

export default SignIn

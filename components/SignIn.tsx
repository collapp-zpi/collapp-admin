import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import SubmitButton from '../shared/components/button/SubmitButton'
import { UncontrolledForm } from '../shared/components/form/UncontrolledForm'
import { InputText } from '../shared/components/input/InputText'
import { MdAlternateEmail } from 'react-icons/md'

const schema = object().shape({
  email: string().required(),
})

const onSuccess = () => {
  toast.success('Email was sent')
}

const onError = () => {
  toast.error('Email was not send')
}

const query = () => {}

const SignIn = () => {
  return (
    <UncontrolledForm {...{ schema, query, initial, onSuccess, onError }}>
      <InputText name="email" label="Email" icon={MdAlternateEmail} />
      <SubmitButton />
    </UncontrolledForm>
  )
}

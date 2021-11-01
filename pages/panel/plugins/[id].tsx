import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import Modal from 'shared/components/Modal'
import Button from 'shared/components/button/Button'
import ErrorPage from 'includes/components/ErrorPage'
import LoadingSessionLayout from 'includes/components/LoadingSession'
import NavigationPanel from 'includes/components/NavigationPanel'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const res = await fetch(`${process.env.BASE_URL}/api/plugins/${id}`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })

  const isError = !res.ok

  if (isError) {
    return { props: { error: await res.json(), isError } }
  }

  return {
    props: {
      plugin: await res.json(),
      isError: !res.ok,
    },
  }
}

const Plugin = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  if (props.isError) {
    return (
      <LoadingSessionLayout>
        <ErrorPage {...props.error} />
      </LoadingSessionLayout>
    )
  }

  const router = useRouter()
  const { icon, name, description, createdAt } = props.plugin
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Head>
        <title>Plugin</title>
      </Head>
      <NavigationPanel>
        <Button onClick={() => router.back()} className="mr-auto my-3 ml-3">
          Back
        </Button>
        <div className="m-auto">
          <div className="bg-gray-50 shadow-2xl py-6 px-10 rounded-2xl my-4">
            <div className="flex items-center ml-6 pb-4">
              <img
                src={icon || '/collapp.svg'}
                className="w-52 h-52 rounded-2xl"
              />
              <div className="flex flex-col ml-4">
                <h1 className="text-4xl font-bold mt-10">{name}</h1>
                <p className="mt-4">{dayjs(createdAt).format('LLL')}</p>
              </div>
            </div>
            <p className="text-center italic p-4">"{description}"</p>
            <hr className="bg-gray-300 -mx-4 mb-4" />
            <Button disabled={true}>Download</Button>
            <Button onClick={() => setVisible(true)}>Modal</Button>
            <Modal visible={visible}>UMC</Modal>
          </div>
        </div>
      </NavigationPanel>
    </div>
  )
}

export default Plugin

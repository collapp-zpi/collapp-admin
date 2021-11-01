import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useState } from 'react'
import Modal from 'shared/components/Modal'
import Button from 'shared/components/button/Button'
import ErrorPage from 'includes/components/ErrorPage'
import LoadingSessionLayout from 'includes/components/LoadingSession'
import NavigationPanel from 'includes/components/NavigationPanel'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import download from 'downloadjs'
import { amazonUrl } from 'shared/utils/awsHelpers'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import plugin from 'dayjs/plugin/localizedFormat'

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
  const { icon, name, description, createdAt, source, authorId, isPending } =
    props.plugin
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Head>
        <title>Plugin</title>
      </Head>
      <NavigationPanel>
        <Button onClick={() => router.back()} className="mr-auto mt-3 ml-3">
          <MdOutlineArrowBackIosNew className="mr-2 -ml-2" />
          Back
        </Button>
        <div className="m-auto">
          <div className="bg-gray-50 shadow-2xl py-6 px-12 rounded-2xl mb-4">
            <div className="flex items-center">
              <img
                src={icon || '/collapp.svg'}
                className="w-52 h-52 rounded-2xl"
              />
              <div className="flex flex-col ml-8">
                <h1 className="text-4xl font-bold">{name}</h1>
                <p className="mt-4">{dayjs(createdAt).format('LLL')}</p>
              </div>
            </div>
            <p className="text-center italic p-4 my-8 rounded-3xl bg-gray-200">
              "{!!description ? description : '-'}"
            </p>
            <div className="m-auto">
              <div className="flex items-center justify-center space-x-4 my-2">
                <p>Author:</p>
                <Button
                  className="border-2 border-gray-400"
                  color="light"
                  onClick={() => router.push(`/panel/developers/${authorId}`)}
                >
                  Developer
                </Button>
              </div>
              {!!source && (
                <div className="flex items-center justify-center space-x-4 my-2">
                  <p>Source:</p>
                  <Button
                    className="border-2 border-gray-400"
                    color="light"
                    onClick={() => download(amazonUrl + source.url)}
                  >
                    Download
                  </Button>
                </div>
              )}
            </div>
            {isPending && (
              <div className="mt-8">
                <hr className="border-gray-300" />
                <Button
                  className="mx-auto mt-4"
                  color="red"
                  onClick={() => setVisible(true)}
                >
                  Decide
                </Button>
                <Modal visible={visible} close={() => setVisible(false)}>
                  WIP
                </Modal>
              </div>
            )}
          </div>
        </div>
      </NavigationPanel>
    </div>
  )
}

export default Plugin

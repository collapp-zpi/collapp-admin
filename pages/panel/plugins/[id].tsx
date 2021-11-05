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
import {
  BsPersonCircle,
  BsFillCloudDownloadFill,
  BsFillQuestionSquareFill,
} from 'react-icons/bs'
import {
  InputRangeFrame,
  PureInputRange,
} from 'shared/components/input/InputRange'
import { CgSpinner } from 'react-icons/cg'
import request from 'shared/utils/request'
import toast from 'react-hot-toast'
import { generateKey } from 'shared/utils/object'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { useQuery } from 'shared/hooks/useQuery'
import { withFallback } from 'shared/hooks/useApiForm'

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
      fallback: {
        [generateKey('plugin', String(id))]: await res.json(),
      },
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
  const pathId = String(router.query.id)
  const { data } = useQuery(['plugin', pathId], `/api/plugins/${pathId}`)
  const [visible, setVisible] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [accepting, setAcceptiing] = useState(false)

  if (!data) {
    return (
      <LoadingSessionLayout>
        <div className="m-auto">
          <LogoSpinner />
        </div>
      </LoadingSessionLayout>
    )
  }

  const {
    id,
    icon,
    name,
    description,
    createdAt,
    source,
    authorId,
    isPending,
    isBuilding,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
  } = data

  const closeModal = () => {
    setVisible(rejecting || accepting)
  }

  const handleReject = async () => {
    setRejecting(true)

    try {
      const data = await request.patch(`/api/plugins/${id}/reject`)
      setRejecting(false)
      setVisible(false)
      toast.success('Plugin was rejected')
    } catch (e: any) {
      toast.error(e?.message)
      setRejecting(false)
    }
  }

  const handleAccept = () => {
    setAcceptiing(true)
  }

  return (
    <div>
      <Head>
        <title>Plugin</title>
      </Head>
      <NavigationPanel>
        <Button
          color="light"
          onClick={() => router.back()}
          className="mr-auto mt-3 ml-3 border-2 border-gray-400"
        >
          <MdOutlineArrowBackIosNew className="mr-2 -ml-2" />
          Back
        </Button>
        <div className="m-auto">
          <div className="bg-gray-50 shadow-2xl py-8 px-16 rounded-2xl mb-4">
            <div className="flex items-center">
              <img
                src={icon || '/collapp.svg'}
                className="w-40 h-40 rounded-2xl"
              />
              <div className="flex flex-col ml-8">
                <h1 className="text-4xl font-bold">{name}</h1>
                <p className="mt-4">{dayjs(createdAt).format('LLL')}</p>
              </div>
            </div>
            <p className="text-center italic p-2 my-12 rounded-lg bg-gray-100 border-2">
              "{!!description ? description : '-'}"
            </p>
            <div className="flex justify-around space-x-8 mb-8">
              <InputRangeFrame
                className="mt-2 flex-1"
                label="Height"
                display={
                  minHeight === maxHeight
                    ? minHeight
                    : `${minHeight} - ${maxHeight}`
                }
              >
                <PureInputRange
                  values={[minHeight, maxHeight]}
                  onChange={() => {}}
                  min={1}
                  max={4}
                  disabled={true}
                />
              </InputRangeFrame>

              <InputRangeFrame
                className="mt-2 flex-1"
                label="Width"
                display={
                  minWidth === maxWidth ? minWidth : `${minWidth} - ${maxWidth}`
                }
              >
                <PureInputRange
                  values={[minWidth, maxWidth]}
                  onChange={() => {}}
                  min={1}
                  max={4}
                  disabled={true}
                />
              </InputRangeFrame>
            </div>
            <div className="m-auto">
              <div className="flex items-center justify-center space-x-4 my-3">
                <p>Author:</p>
                <Button
                  onClick={() => router.push(`/panel/developers/${authorId}`)}
                >
                  <BsPersonCircle className="mr-2 -ml-2" />
                  Developer
                </Button>
              </div>
              {!!source && (
                <div className="flex items-center justify-center space-x-4 my-3">
                  <p>Source:</p>
                  <Button onClick={() => download(amazonUrl + source.url)}>
                    <BsFillCloudDownloadFill className="mr-2 -ml-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            {isPending && !!source && !isBuilding && (
              <div className="mt-8">
                <hr className="border-gray-300" />
                <Button
                  className="mx-auto mt-4"
                  color="red"
                  onClick={() => setVisible(true)}
                >
                  <BsFillQuestionSquareFill className="mr-2 -ml-2" />
                  Decide
                </Button>
                <Modal visible={visible} close={() => closeModal()}>
                  <div className="flex flex-col m-8">
                    <h1 className="text-center text-3xl text-red-500">
                      Carefully
                    </h1>
                    <p className="py-8">
                      What would you like to do with this plugin?
                    </p>
                    <div className="flex justify-evenly space-x-8 align-bottom">
                      <Button
                        className={`flex-1 transition-all ${
                          (accepting || rejecting) && 'opacity-70'
                        }`}
                        onClick={handleAccept}
                        disabled={rejecting || accepting}
                      >
                        {accepting && (
                          <CgSpinner className="animate-spin mr-2 -ml-2" />
                        )}
                        Accept
                      </Button>
                      <Button
                        className={`flex-1 border-2 border-red-500 transition-all ${
                          (accepting || rejecting) && 'opacity-70'
                        }`}
                        color="red-link"
                        onClick={handleReject}
                        disabled={rejecting || accepting}
                      >
                        {rejecting && (
                          <CgSpinner className="animate-spin mr-2 -ml-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </NavigationPanel>
    </div>
  )
}

export default withFallback(Plugin)

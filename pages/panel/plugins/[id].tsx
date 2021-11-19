import type { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import Modal from 'shared/components/Modal'
import Button from 'shared/components/button/Button'
import NavigationPanel from 'includes/components/NavigationPanel'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import download from 'downloadjs'
import { amazonUrl } from 'shared/utils/awsHelpers'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { BsFileEarmarkZip, BsFillQuestionSquareFill } from 'react-icons/bs'
import {
  InputRangeFrame,
  PureInputRange,
} from 'shared/components/input/InputRange'
import { CgSoftwareDownload, CgSpinner } from 'react-icons/cg'
import request from 'shared/utils/request'
import toast from 'react-hot-toast'
import { generateKey } from 'shared/utils/object'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { useQuery } from 'shared/hooks/useQuery'
import { withFallback } from 'shared/hooks/useApiForm'
import { useSWRConfig } from 'swr'
import Link from 'next/link'
import { withAuth } from 'shared/hooks/useAuth'
import { ErrorInfo } from 'shared/components/ErrorInfo'
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5'
import { defaultPluginIcon } from 'shared/utils/defaultIcons'

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

  if (!res.ok) {
    return { props: { error: await res.json() } }
  }

  return {
    props: {
      fallback: {
        [generateKey('plugin', String(id))]: await res.json(),
      },
    },
  }
}

export const parseFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (
    (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i]
  )
}

interface LogType {
  id: string
  content: string
  date: string
  admin: {
    email?: string
  }
}

const Plugin = () => {
  const router = useRouter()
  const pathId = String(router.query.id)
  const { data, error } = useQuery(['plugin', pathId], `/api/plugins/${pathId}`)
  const [visible, setVisible] = useState(false)

  const {
    icon,
    name,
    description,
    createdAt,
    source,
    authorId,
    author,
    isPending,
    isBuilding,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
    logs,
  } = data || {}

  const canReview = isPending && !!source && !isBuilding

  return (
    <div>
      <Head>
        <title>Plugin</title>
      </Head>
      <NavigationPanel>
        <div className="flex justify-between">
          <Button color="light" onClick={() => router.back()}>
            <MdOutlineArrowBackIosNew className="mr-2 -ml-2" />
            Back
          </Button>
          {canReview && (
            <Button onClick={() => setVisible(true)}>
              <BsFillQuestionSquareFill className="mr-2 -ml-2" />
              Review
            </Button>
          )}
        </div>
        {error ? (
          <div className="mt-12">
            <ErrorInfo error={error} />
          </div>
        ) : !data ? (
          <div className="m-auto p-12">
            <LogoSpinner />
          </div>
        ) : (
          <div className="m-auto mt-4">
            <div className="bg-white shadow-2xl p-8 rounded-3xl">
              <div className="flex items-center">
                <img
                  src={icon || defaultPluginIcon}
                  className="w-36 h-36 rounded-25 border-2"
                  alt="Plugin icon"
                />
                <div className="flex flex-col ml-8">
                  <h1 className="text-3xl font-bold">{name}</h1>
                  <Link href={`/panel/developers/${authorId}`} passHref>
                    <h3 className="font-bold text-blue-500 hover:text-blue-700 cursor-pointer transition-colors mt-1">
                      {author?.name}
                    </h3>
                  </Link>
                  <p className="mt-1 font-light text-sm">
                    {dayjs(createdAt).format('LLL')}
                  </p>
                </div>
              </div>
              {!!description && (
                <p className="text-center italic p-2 mt-8 rounded-lg bg-gray-100 border-2">
                  {'"'}
                  {description}
                  {'"'}
                </p>
              )}

              <div className="flex justify-around space-x-8 mb-8 mt-12">
                <InputRangeFrame
                  className="flex-1 mx-4"
                  label="Width"
                  display={
                    minWidth === maxWidth
                      ? minWidth
                      : `${minWidth} - ${maxWidth}`
                  }
                >
                  <PureInputRange
                    values={[minWidth, maxWidth]}
                    min={1}
                    max={4}
                    disabled={true}
                  />
                </InputRangeFrame>

                <InputRangeFrame
                  className="mx-4 flex-1"
                  label="Height"
                  display={
                    minHeight === maxHeight
                      ? minHeight
                      : `${minHeight} - ${maxHeight}`
                  }
                >
                  <PureInputRange
                    values={[minHeight, maxHeight]}
                    min={1}
                    max={4}
                    disabled={true}
                  />
                </InputRangeFrame>
              </div>
            </div>
            <div className="bg-white shadow-2xl p-8 rounded-3xl mt-4">
              <h1 className="text-xl font-bold mb-4">File</h1>
              <div className="flex items-center">
                <div className="flex items-center justify-center py-2 pr-4 text-gray-400">
                  <BsFileEarmarkZip size="2rem" />
                </div>
                <div className="flex flex-col mr-auto">
                  <div className="font-bold">{source?.name}</div>
                  {!!source?.date && (
                    <div className="text-sm">
                      {dayjs(source?.date).format('LLL')}
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    {parseFileSize(source?.size)}
                  </div>
                </div>
                <Button
                  hasIcon
                  color="light"
                  onClick={() => download(amazonUrl + source.url)}
                >
                  <CgSoftwareDownload size="1.5rem" />
                </Button>
              </div>
            </div>
            <div className="bg-white shadow-2xl p-8 rounded-3xl mt-4">
              <h1 className="text-xl font-bold mb-4">Logs</h1>
              <table>
                <thead>
                  <tr>
                    <td className="py-2 px-3 font-bold">Date</td>
                    <td className="py-2 px-3 font-bold">Message</td>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(({ id, date, content, admin }: LogType) => (
                    <tr key={id} className="text-gray-500 text-sm mt-2">
                      <td className="py-1 px-4">{dayjs(date).format('LLL')}</td>
                      <td className="py-1 px-4 flex">
                        {content}
                        {!!admin && (
                          <p className="ml-1">
                            {'by admin '}
                            <span className="underline font-semibold">
                              {admin?.email}
                            </span>
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {canReview && (
              <ReviewModal visible={visible} close={() => setVisible(false)} />
            )}
          </div>
        )}
      </NavigationPanel>
    </div>
  )
}

export default withAuth(withFallback(Plugin))

const ReviewModal = ({
  visible,
  close,
}: {
  visible: boolean
  close: () => void
}) => {
  const router = useRouter()
  const id = String(router.query.id)
  const { mutate } = useSWRConfig()
  const [rejecting, setRejecting] = useState(false)
  const [accepting, setAccepting] = useState(false)

  const handleModalButtons = async (decision: boolean) => {
    const setStatus = decision ? setAccepting : setRejecting
    setStatus(true)

    try {
      await request.patch(
        `/api/plugins/${id}/${decision ? 'accept' : 'reject'}`,
      )
      setStatus(false)
      close()
      toast.success(
        `Plugin was ${decision ? 'accepted' : 'rejected'} successfully`,
      )
      return mutate(generateKey('plugin', id))
    } catch (e: any) {
      toast.error(e?.message)
      setStatus(false)
    }
  }

  const handleReject = () => handleModalButtons(false)

  const handleAccept = () => handleModalButtons(true)

  const handleClose = () => {
    if (rejecting || accepting) return

    close()
  }

  return (
    <Modal visible={visible} close={handleClose}>
      <div className="flex flex-col m-8">
        <h1 className="text-center text-3xl text-red-500">Careful!</h1>
        <p className="py-8">What would you like to do with this plugin?</p>
        <div className="grid grid-cols-2 mt-4 gap-4">
          <Button
            color="red"
            onClick={handleReject}
            disabled={rejecting || accepting}
          >
            {rejecting ? (
              <CgSpinner className="animate-spin mr-2 -ml-2" />
            ) : (
              <IoCloseSharp className="mr-2 -ml-2" />
            )}
            Reject
          </Button>
          <Button onClick={handleAccept} disabled={rejecting || accepting}>
            {accepting ? (
              <CgSpinner className="animate-spin mr-2 -ml-2" />
            ) : (
              <IoCheckmarkSharp className="mr-2 -ml-2" />
            )}
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  )
}

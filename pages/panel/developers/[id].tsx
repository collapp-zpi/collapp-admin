import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'
import PluginsList from 'includes/components/PluginsList'
import ErrorPage from 'includes/components/ErrorPage'
import LoadingSessionLayout from 'includes/components/LoadingSession'
import NavigationPanel from 'includes/components/NavigationPanel'
import Button from 'shared/components/button/Button'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { generateKey } from 'shared/utils/object'
import { useQuery } from 'shared/hooks/useQuery'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { withFallback } from 'shared/hooks/useApiForm'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const developerRes = await fetch(
    `${process.env.BASE_URL}/api/developers/${id}`,
    {
      method: 'GET',
      headers: {
        ...(context?.req?.headers?.cookie && {
          cookie: context.req.headers.cookie,
        }),
      },
    },
  )

  let isError = !developerRes.ok

  if (isError) {
    return { props: { error: await developerRes.json(), isError } }
  }

  const pluginsRes = await fetch(
    `${process.env.BASE_URL}/api/developers/${id}/plugins`,
    {
      method: 'GET',
      headers: {
        ...(context?.req?.headers?.cookie && {
          cookie: context.req.headers.cookie,
        }),
      },
    },
  )

  isError = !pluginsRes.ok
  if (isError) {
    return { props: { error: await pluginsRes.json(), isError } }
  }

  return {
    props: {
      developer: await developerRes.json(),
      fallback: {
        [generateKey('plugins', String(id))]: await pluginsRes.json(),
      },
    },
  }
}

const Developer = (
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
  const { data } = useQuery(
    ['plugins', pathId],
    `/api/developers/${pathId}/plugins`,
  )
  const { image, name, email } = props.developer

  return (
    <div>
      <Head>
        <title>Developer</title>
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
          <div className="flex bg-gray-50 shadow-2xl p-6 rounded-2xl items-center my-4 px-8">
            <img src={image} alt="" className="w-52 h-52 rounded-2xl" />
            <div className="flex flex-col ml-8">
              <h1 className="text-4xl font-bold mt-8">{name}</h1>
              <p className="mt-4">Email: {!email ? '-' : email}</p>
            </div>
          </div>
          {!data ? (
            <div className="m-auto">
              <LogoSpinner />
            </div>
          ) : data?.entities.length ? (
            <div className="bg-gray-50 rounded-2xl shadow-2xl p-8 mb-4">
              <h2 className="text-xl font-bold ml-2 mb-4">
                Developer's plugins:
              </h2>
              <PluginsList plugins={data?.entities} isCompact={true} />
            </div>
          ) : (
            <p className="ml-2">Developers hasn't created any plugins yet</p>
          )}
        </div>
      </NavigationPanel>
    </div>
  )
}

export default withFallback(Developer)

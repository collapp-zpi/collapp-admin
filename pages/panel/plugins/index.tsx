import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import PluginsList from 'components/PluginsList'
import ErrorPage from 'components/ErrorPage'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/plugins`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  const isError = !res.ok

  if (isError) {
    return {
      props: {
        error: await res.json(),
        isError,
      },
    }
  }

  const { plugins, pagination } = await res.json()

  return {
    props: { plugins, pagination, isError },
  }
}

export default function Plugins(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  if (props.isError) {
    return <ErrorPage {...props.error}></ErrorPage>
  }

  return (
    <div>
      <Link href="../">
        <button>Back</button>
      </Link>
      <PluginsList plugins={props.plugins} />
    </div>
  )
}

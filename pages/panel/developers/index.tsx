import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import DevelopersList from 'includes/components/DevelopersList'
import ErrorPage from 'includes/components/ErrorPage'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/developers`, {
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

  const { entities, pagination } = await res.json()
  return {
    props: { developers: entities, pagination, isError },
  }
}

export default function Developers(
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
      <DevelopersList developers={props.developers} />
    </div>
  )
}

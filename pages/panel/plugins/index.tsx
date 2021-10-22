import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import PluginsList from 'components/PluginsList'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/plugins`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  const { plugins, pagination } = await res.json()

  return {
    props: { plugins, pagination },
  }
}

export default function FirstPost(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { data } = useSession()

  if (!data) return null

  return (
    <div>
      <Link href="../">
        <button>Back</button>
      </Link>
      <PluginsList plugins={props.plugins} />
    </div>
  )
}

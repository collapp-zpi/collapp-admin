import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import PluginsList from '../../../components/PluginsList'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/plugins`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  const plugins = await res.json()

  return {
    props: { plugins },
  }
}

export default function FirstPost(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const router = useRouter()

  useEffect(() => {
    if (!data) {
      router.push('../')
    }
  }, [])

  const { data } = useSession()
  if (data)
    return (
      <div>
        <Link href="../">
          <button>Back</button>
        </Link>
        <PluginsList plugins={props.plugins} />
      </div>
    )

  return null
}

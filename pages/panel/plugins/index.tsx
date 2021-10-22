import { DraftPlugin } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
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
  const { plugins, pagination } = await res.json()

  return {
    props: { plugins, pagination },
  }
}

export default function FirstPost(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { data } = useSession()

  const [pluginList, setPluginList] = useState(props.plugins)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let filteredPlugins: DraftPlugin[] = props.plugins
    if (name !== '') {
      filteredPlugins = filteredPlugins.filter((plugin: DraftPlugin) =>
        plugin.name.toLowerCase().includes(name.toLowerCase()),
      )
    }

    if (status !== '') {
      filteredPlugins = filteredPlugins.filter(
        (plugin: DraftPlugin) => plugin.status === status,
      )
    }

    setPluginList(filteredPlugins)
  }, [name, status])

  if (!data) return null

  return (
    <div>
      <Link href="../">
        <button>Back</button>
      </Link>
      <PluginsList plugins={pluginList} />
    </div>
  )
}

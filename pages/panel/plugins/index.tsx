import { DraftPlugin } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import PluginsList from '../../../components/PluginsList'
import Statuses from '../../../config/PluginStatuses'

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
      <div>
        <label>
          Name:
          <input
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {Statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <PluginsList plugins={pluginList} />
    </div>
  )
}

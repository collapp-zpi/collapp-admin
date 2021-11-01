import React from 'react'
import { DraftPlugin } from '@prisma/client'
import Link from 'next/link'
import classNames from 'classnames'
import dayjs from 'dayjs'

const PluginsList = ({ plugins }: { plugins: DraftPlugin[] }) => (
  <div className="m-auto bg-gray-50 shadow-2xl p-8 rounded-2xl">
    <table className="text-center">
      <thead className="px-6 py-4">
        <tr>
          <th className="px-2 py-4"></th>
          <th className="px-10 py-4">Name</th>
          <th className="px-10 py-4">Date</th>
          <th className="px-10 py-4">Pending</th>
        </tr>
      </thead>
      <tbody>
        {plugins.map((plugin: DraftPlugin) => (
          <Link key={plugin.id} href={`/panel/plugins/${plugin.id}`}>
            <tr style={{ cursor: 'pointer' }}>
              <td className="px-2 py-4">
                <img
                  src={plugin.icon || '/collapp.svg'}
                  alt="Plugin Icon"
                  className="w-40 h-40 rounded-full"
                />
              </td>
              <td className="px-10 py-4">{plugin.name}</td>
              <td className="px-10 py-4">
                {dayjs(plugin.createdAt).format('LLL')}
              </td>
              <td className="px-10 py-4">
                <div
                  className={classNames(
                    'w-4 h-4 rounded-full mx-auto',
                    plugin.isPending ? 'bg-green-500' : 'bg-gray-300',
                  )}
                />
              </td>
            </tr>
          </Link>
        ))}
      </tbody>
    </table>
  </div>
)

export default PluginsList

import React from 'react'
import { DraftPlugin } from '@prisma/client'
import Link from 'next/link'
import classNames from 'classnames'
import dayjs from 'dayjs'

const PluginsList = ({
  plugins,
  isCompact,
}: {
  plugins: DraftPlugin[]
  isCompact: boolean
}) => {
  const { padding, imgSize }: { padding: string; imgSize: string } = !isCompact
    ? { padding: 'px-10 py-4', imgSize: 'w-40 h-40 rounded-full' }
    : { padding: 'px-6 py-2', imgSize: 'w-20 h-20 rounded-full' }
  return (
    <div className="m-auto bg-gray-50 shadow-2xl p-8 rounded-2xl">
      <table className="text-center">
        <thead className="px-6 py-4">
          <tr>
            <th className="px-2 py-4"></th>
            <th className={padding}>Name</th>
            <th className={padding}>Date</th>
            <th className={padding}>Pending</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((plugin: DraftPlugin) => (
            <Link key={plugin.id} href={`/panel/plugins/${plugin.id}`}>
              <tr style={{ cursor: 'pointer' }} className="hover:bg-gray-200">
                <td className="px-2 py-4">
                  <img
                    src={plugin.icon || '/collapp.svg'}
                    alt="Plugin Icon"
                    className={imgSize}
                  />
                </td>
                <td className={padding}>{plugin.name}</td>
                <td className={padding}>
                  {dayjs(plugin.createdAt).format('LLL')}
                </td>
                <td className={padding}>
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
}

export default PluginsList

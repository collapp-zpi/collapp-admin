import React from 'react'
import { DraftPlugin } from '@prisma/client'
import Link from 'next/link'
import classNames from 'classnames'
import dayjs from 'dayjs'
import {
  buildingColor,
  pendingColor,
  privateColor,
} from 'includes/utils/statusColors'

const StatusColors = () => (
  <div className="flex justify-end items-center mt-5">
    <div className={`w-4 h-4 rounded-full ${privateColor}`} />
    <p>-Private</p>

    <div className={`ml-3 w-4 h-4 rounded-full ${pendingColor}`} />
    <p>-Pending</p>

    <div className={`ml-3 w-4 h-4 rounded-full ${buildingColor}`} />
    <p>-Building</p>
  </div>
)

const PluginsList = ({
  plugins,
  isCompact,
}: {
  plugins: DraftPlugin[]
  isCompact: boolean
}) => {
  const { padding, imgSize }: { padding: string; imgSize: string } = !isCompact
    ? { padding: 'px-8 py-4', imgSize: 'w-32 h-32 rounded-full' }
    : { padding: 'px-6 py-2', imgSize: 'w-20 h-20 rounded-full' }
  return (
    <div>
      {!isCompact && <StatusColors />}
      <div className="flex justify-center m-auto bg-gray-50 shadow-2xl p-8 rounded-2xl">
        <table className="text-center flex-1">
          <thead className="px-6 py-4">
            <tr>
              <th className="px-2 py-4"></th>
              <th className={padding}>Name</th>
              <th className={padding}>Date</th>
              <th className={padding}>Status</th>
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
                      className={`${imgSize} border-2 border-gray-300`}
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
                        plugin.isPending
                          ? plugin.isBuilding
                            ? buildingColor
                            : pendingColor
                          : privateColor,
                      )}
                    />
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PluginsList

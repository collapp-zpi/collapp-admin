import React from 'react'
import { DraftPlugin } from '@prisma/client'
import Link from 'next/link'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { truncate } from 'shared/utils/text'
import { Tooltip } from 'shared/components/Tooltip'
import { defaultPluginIcon } from 'shared/utils/defaultIcons'

const PluginsList = ({
  plugins,
  isCompact = false,
}: {
  plugins: DraftPlugin[]
  isCompact?: boolean
}) => {
  const { padding, imgSize } = isCompact
    ? { padding: 'p-3', imgSize: 'w-6 h-6' }
    : { padding: 'p-4', imgSize: 'w-8 h-8' }

  return (
    <table className="flex-1 w-full">
      <thead>
        <tr className="text-left">
          <th className={padding}>Name</th>
          <th className={padding}>Description</th>
          <th className={padding}>Date</th>
          <th className={padding}>Status</th>
        </tr>
      </thead>
      <tbody>
        {plugins.map((plugin: DraftPlugin) => (
          <Link key={plugin.id} href={`/panel/plugins/${plugin.id}`} passHref>
            <tr className="bg-blue-500 bg-opacity-0 hover:bg-opacity-10 cursor-pointer transition-colors">
              <td className={classNames(padding, 'flex items-center')}>
                <img
                  src={plugin.icon || defaultPluginIcon}
                  className={classNames(
                    imgSize,
                    'shadow-lg mr-3 bg-gray-150 rounded-25 bg-white',
                  )}
                  alt="Plugin icon"
                />
                {truncate(plugin.name, 50)}
              </td>

              <td className={padding}>
                {truncate(plugin.description, isCompact ? 50 : 100)}
              </td>
              <td className={classNames(padding, 'text-sm break-normal')}>
                {dayjs(plugin.createdAt).format('LLL')}
              </td>
              <td className={padding}>
                <Tooltip
                  value={
                    plugin.isBuilding
                      ? 'Building'
                      : plugin.isPending
                      ? 'Pending'
                      : 'Draft'
                  }
                >
                  <div
                    className={classNames(
                      'w-4 h-4 rounded-full',
                      plugin.isBuilding
                        ? 'bg-yellow-500'
                        : plugin.isPending
                        ? 'bg-green-500'
                        : 'bg-gray-300',
                    )}
                  />
                </Tooltip>
              </td>
            </tr>
          </Link>
        ))}
      </tbody>
    </table>
  )
}

export default PluginsList

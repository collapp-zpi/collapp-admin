import React from 'react'
import { DraftPlugin } from '@prisma/client'
import Link from 'next/link'

const PluginsList = ({ plugins }: { plugins: DraftPlugin[] }) => (
  <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {plugins.map((plugin: DraftPlugin) => (
          <Link href={`/panel/plugins/${plugin.id}`}>
            <tr style={{ cursor: 'pointer' }}>
              <td>
                <img src={plugin.icon || ''} alt="" />
              </td>
              <td>{plugin.name}</td>
              <td>{plugin.date}</td>
              <td>{plugin.status}</td>
            </tr>
          </Link>
        ))}
      </tbody>
    </table>
  </div>
)

export default PluginsList
